<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Cart;
use App\Models\Courier;
use App\Models\CourierRoute;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Product;
use App\Models\RouteStop;
use App\Models\Setting;
use App\Models\StockMovement;
use App\Models\User;
use App\Models\Voucher;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderService
{
    public function __construct(private MidtransService $midtrans) {}

    /** Alur status yang diperbolehkan. Key = status sekarang, value = status tujuan yang sah. */
    private const TRANSITIONS = [
        'baru'       => ['diproses', 'dibatalkan'],
        'diproses'   => ['diantar', 'dibatalkan'],
        'diantar'    => ['selesai', 'dibatalkan'],
        'selesai'    => [],
        'dibatalkan' => [],
    ];

    /**
     * Hitung rincian biaya dari isi keranjang. Dipakai untuk TAMPILAN (halaman checkout)
     * dan untuk PERHITUNGAN FINAL saat order dibuat, supaya angkanya selalu sama.
     * Harga selalu dibaca dari database, tidak pernah dipercaya dari input browser.
     */
    public function summary(Cart $cart, ?string $voucherCode = null): array
    {
        $cart->load('items.product');

        $subtotal = (float) $cart->items->sum(fn ($i) => $i->qty * $i->product->harga_jual);

        $ongkirAsli   = (float) Setting::get('ongkir_flat', 2000);
        $gratisMin    = (float) Setting::get('gratis_ongkir_minimal', 30000);
        $ongkir       = $subtotal >= $gratisMin ? 0.0 : $ongkirAsli;
        $biayaKantong = (float) Setting::get('biaya_kantong', 500);

        $voucher = null;
        $potongan = 0.0;
        $voucherError = null;

        if ($voucherCode) {
            $found = Voucher::where('kode', $voucherCode)->first();

            if (!$found || !$found->isValid()) {
                $voucherError = 'Kode voucher tidak valid atau sudah kedaluwarsa.';
            } elseif ($found->minimal_belanja && $subtotal < (float) $found->minimal_belanja) {
                $voucherError = 'Minimal belanja untuk voucher ini Rp ' . number_format($found->minimal_belanja, 0, ',', '.') . '.';
            } else {
                $voucher = $found;
                $potongan = $found->tipe === 'persen'
                    ? round($subtotal * (float) $found->nilai / 100)
                    : (float) $found->nilai;
                $potongan = min($potongan, $subtotal);
            }
        }

        return [
            'subtotal'         => $subtotal,
            'ongkir'           => $ongkir,
            'ongkir_asli'      => $ongkirAsli,
            'biaya_kantong'    => $biayaKantong,
            'potongan_voucher' => $potongan,
            'total'            => $subtotal + $ongkir + $biayaKantong - $potongan,
            'voucher'          => $voucher,
            'voucher_error'    => $voucherError,
        ];
    }

    /**
     * Membuat pesanan secara atomik. Jika satu langkah gagal, SEMUA dibatalkan
     * (order tidak terbentuk, stok tidak berkurang).
     */
    public function place(User $user, Cart $cart, array $data): Order
    {
        return DB::transaction(function () use ($user, $cart, $data) {
            $cart->load('items');

            if ($cart->items->isEmpty()) {
                throw ValidationException::withMessages(['cart' => 'Keranjang masih kosong.']);
            }

            // Kunci baris produk: dua pelanggan yang membeli stok terakhir tidak bisa lolos bersamaan.
            $products = Product::whereIn('id', $cart->items->pluck('product_id'))
                ->lockForUpdate()->get()->keyBy('id');

            foreach ($cart->items as $item) {
                $product = $products->get($item->product_id);

                if (!$product || $product->status !== 'aktif') {
                    throw ValidationException::withMessages(['cart' => 'Ada produk di keranjang yang sudah tidak tersedia. Silakan periksa keranjang.']);
                }
                if ($product->stok < $item->qty) {
                    throw ValidationException::withMessages(['cart' => "Stok {$product->nama} tinggal {$product->stok}. Kurangi jumlahnya di keranjang."]);
                }
            }

            $batch = DeliveryBatch::whereKey($data['delivery_batch_id'])->lockForUpdate()->firstOrFail();
            if (!$batch->status_aktif || $batch->terpakai >= $batch->kuota) {
                throw ValidationException::withMessages(['delivery_batch_id' => "Kuota kloter {$batch->nama_kloter} sudah penuh. Pilih kloter lain."]);
            }

            $summary = $this->summary($cart, $data['voucher_kode'] ?? null);

            if (!empty($data['voucher_kode']) && !$summary['voucher']) {
                throw ValidationException::withMessages(['voucher_kode' => $summary['voucher_error']]);
            }
            if ($summary['voucher']) {
                // Cek ulang dengan kunci baris supaya kuota voucher tidak jebol saat rebutan.
                $voucher = Voucher::whereKey($summary['voucher']->id)->lockForUpdate()->first();
                if (!$voucher->isValid()) {
                    throw ValidationException::withMessages(['voucher_kode' => 'Voucher sudah habis kuotanya.']);
                }
            }

            $metode = $data['metode_bayar'];
            $codNominal = $metode === 'cod' && isset($data['cod_nominal_disiapkan']) && $data['cod_nominal_disiapkan'] !== ''
                ? (float) $data['cod_nominal_disiapkan'] : null;

            if ($codNominal !== null && $codNominal < $summary['total']) {
                throw ValidationException::withMessages(['cod_nominal_disiapkan' => 'Nominal uang yang disiapkan minimal sebesar total tagihan.']);
            }

            // Alamat: pakai ulang bila persis sama, supaya tidak menumpuk baris duplikat.
            $address = Address::firstOrCreate(
                [
                    'user_id'          => $user->id,
                    'nama_penerima'    => $data['nama_penerima'],
                    'telepon_penerima' => $data['telepon_penerima'],
                    'alamat_lengkap'   => $data['alamat_lengkap'],
                    'catatan_patokan'  => $data['catatan_patokan'] ?? null,
                ],
                ['label' => 'Rumah', 'is_default' => false]
            );

            if (!empty($data['simpan_alamat'])) {
                Address::where('user_id', $user->id)->update(['is_default' => false]);
                $address->update(['is_default' => true]);
            }

            $order = Order::create([
                'user_id'               => $user->id,
                'address_id'            => $address->id,
                'delivery_batch_id'     => $batch->id,
                'voucher_id'            => $summary['voucher']?->id,
                'subtotal'              => $summary['subtotal'],
                'ongkir'                => $summary['ongkir'],
                'ongkir_asli'           => $summary['ongkir_asli'],
                'biaya_kantong'         => $summary['biaya_kantong'],
                'potongan_voucher'      => $summary['potongan_voucher'],
                'total'                 => $summary['total'],
                'metode_bayar'          => $metode,
                'status_pembayaran'     => 'pending',
                'status_pesanan'        => 'baru',
                'catatan_kurir'         => $data['catatan_patokan'] ?? null,
                'cod_nominal_disiapkan' => $codNominal,
            ]);

            foreach ($cart->items as $item) {
                $product = $products->get($item->product_id);

                $order->items()->create([
                    'product_id'           => $product->id,
                    'nama_produk_snapshot' => $product->nama,
                    'satuan_snapshot'      => $product->satuan,
                    'qty'                  => $item->qty,
                    'harga_satuan'         => $product->harga_jual,
                    'subtotal'             => $item->qty * $product->harga_jual,
                ]);

                $product->decrement('stok', $item->qty);

                StockMovement::create([
                    'product_id' => $product->id,
                    'tipe'       => 'keluar',
                    'qty'        => $item->qty,
                    'sumber'     => "Order {$order->order_number}",
                    'created_by' => $user->id,
                ]);
            }

            $batch->increment('terpakai');
            if ($summary['voucher']) {
                $summary['voucher']->increment('terpakai');
            }

            $this->log($order, 'baru', 'Pesanan dibuat oleh pelanggan.', $user->id);

            $order->payments()->create([
                'channel'           => $metode,
                'midtrans_order_id' => $metode === 'cod' ? null : $order->order_number,
                'status'            => 'pending',
            ]);

            $cart->items()->delete();

            return $order;
        });
    }

    /**
     * Membatalkan pesanan dan mengembalikan stok, slot kloter, dan kuota voucher.
     *
     * $userId null + $viaMidtransWebhook true  = dipicu notifikasi Midtrans (status sudah final di sana, JANGAN panggil cancel lagi).
     * $userId terisi + $viaMidtransWebhook false = dipicu admin/pelanggan dari sistem kita (perlu beri tahu Midtrans supaya order_id tidak menggantung).
     */
    public function cancel(Order $order, string $alasan, ?int $userId = null, bool $viaMidtransWebhook = false): void
    {
        DB::transaction(function () use ($order, $alasan, $userId, $viaMidtransWebhook) {
            $order = Order::lockForUpdate()->findOrFail($order->id);

            if ($order->status_pesanan === 'dibatalkan') {
                return; // idempotent: notifikasi/klik ganda tidak mengembalikan stok dua kali
            }
            if ($order->status_pembayaran === 'lunas' && $userId === null && $viaMidtransWebhook) {
                return; // notifikasi "gagal" susulan tidak boleh membatalkan pesanan yang sudah lunas
            }

            foreach ($order->items as $item) {
                if (!$item->product_id) {
                    continue;
                }
                Product::withTrashed()->whereKey($item->product_id)->increment('stok', $item->qty);

                StockMovement::create([
                    'product_id' => $item->product_id,
                    'tipe'       => 'masuk',
                    'qty'        => $item->qty,
                    'sumber'     => "Pembatalan {$order->order_number}",
                    'keterangan' => $alasan,
                    'created_by' => $userId,
                ]);
            }

            DeliveryBatch::where('id', $order->delivery_batch_id)->where('terpakai', '>', 0)->decrement('terpakai');
            if ($order->voucher_id) {
                Voucher::where('id', $order->voucher_id)->where('terpakai', '>', 0)->decrement('terpakai');
            }

            $order->update([
                'status_pesanan'    => 'dibatalkan',
                'status_pembayaran' => $order->status_pembayaran === 'lunas' ? 'lunas' : 'gagal',
            ]);

            RouteStop::where('order_id', $order->id)->update(['status' => 'selesai']); // keluarkan dari rute aktif kurir

            $this->log($order, 'dibatalkan', $alasan, $userId);

            // Beri tahu Midtrans HANYA kalau kita yang memicu pembatalan (bukan notifikasi dari mereka),
            // dan hanya untuk metode online yang statusnya masih menggantung.
            if (!$viaMidtransWebhook && $order->metode_bayar !== 'cod' && $order->status_pembayaran === 'gagal') {
                $this->midtrans->cancelIfPending($order->order_number);
            }
        });
    }

    /**
     * Ubah status_pesanan oleh admin/kurir, dengan validasi alur (tidak bisa lompat status).
     * Kalau status baru = "selesai" dan metode COD, otomatis dianggap lunas (uang diterima kurir saat itu).
     */
    public function updateStatus(Order $order, string $statusBaru, ?int $userId, ?string $keterangan = null): Order
    {
        return DB::transaction(function () use ($order, $statusBaru, $userId, $keterangan) {
            $order = Order::lockForUpdate()->findOrFail($order->id);

            $diperbolehkan = self::TRANSITIONS[$order->status_pesanan] ?? [];
            if (!in_array($statusBaru, $diperbolehkan, true)) {
                throw ValidationException::withMessages([
                    'status_pesanan' => "Tidak bisa mengubah status dari \"{$order->status_pesanan}\" ke \"{$statusBaru}\".",
                ]);
            }

            if ($statusBaru === 'dibatalkan') {
                $this->cancel($order, $keterangan ?? 'Dibatalkan oleh admin.', $userId);
                return $order->fresh();
            }

            $order->update(['status_pesanan' => $statusBaru]);

            RouteStop::where('order_id', $order->id)->update([
                'status' => $statusBaru === 'diantar' ? 'diantar' : ($statusBaru === 'selesai' ? 'selesai' : 'menunggu'),
            ]);

            if ($statusBaru === 'selesai' && $order->metode_bayar === 'cod' && $order->status_pembayaran !== 'lunas') {
                $order->update(['status_pembayaran' => 'lunas']);

                $payment = $order->payments()->latest()->first();
                $payment?->update(['status' => 'settlement', 'paid_at' => now()]);

                $this->log($order, 'lunas', 'Pembayaran COD diterima kurir saat pesanan selesai.', $userId);
            }

            $this->log($order, $statusBaru, $keterangan, $userId);

            return $order->fresh();
        });
    }

    /** Terapkan status dari notifikasi Midtrans. Aman dipanggil berulang (idempotent). */
    public function applyPaymentStatus(Payment $payment, string $status, array $payload): void
    {
        DB::transaction(function () use ($payment, $status, $payload) {
            $payment = Payment::lockForUpdate()->findOrFail($payment->id);
            $order   = Order::lockForUpdate()->findOrFail($payment->order_id);

            // Simpan payload MENAMBAH, bukan menimpa — snap_token harus tetap ada di raw_response.
            $raw = $payment->raw_response ?? [];
            $raw['notification'] = $payload;

            $payment->fill([
                'status'                  => $status,
                'raw_response'            => $raw,
                'midtrans_transaction_id' => $payload['transaction_id'] ?? $payment->midtrans_transaction_id,
            ]);

            if ($status === 'settlement') {
                if ($order->status_pesanan === 'dibatalkan') {
                    $payment->save();
                    $this->log($order, 'dibatalkan', 'PERHATIAN: pembayaran masuk setelah pesanan dibatalkan. Perlu refund/penanganan manual.');
                    return;
                }

                $payment->paid_at = now();
                $payment->save();

                if ($order->status_pembayaran !== 'lunas') {
                    $order->update(['status_pembayaran' => 'lunas']);
                    $this->log($order, 'lunas', 'Pembayaran diterima via Midtrans.');
                }
                return;
            }

            $payment->save();

            if (in_array($status, ['deny', 'cancel', 'expire'], true)) {
                $this->cancel($order, "Pembayaran {$status} di Midtrans.", null, viaMidtransWebhook: true);
            }
        });
    }

    /**
     * Tugaskan sebuah order ke kurir. Membuat/menemukan CourierRoute untuk
     * (kurir, kloter, tanggal antar) lalu menambahkannya sebagai RouteStop berurutan.
     * Tanggal antar diambil dari tanggal order dibuat (model bisnis: pesan & antar di hari yang sama).
     */
    public function assignToCourier(Order $order, Courier $courier): RouteStop
    {
        return DB::transaction(function () use ($order, $courier) {
            $order = Order::lockForUpdate()->findOrFail($order->id);

            $route = CourierRoute::firstOrCreate(
                [
                    'courier_id'         => $courier->id,
                    'delivery_batch_id'  => $order->delivery_batch_id,
                    'tanggal'            => $order->created_at->toDateString(),
                ],
                ['status' => 'menunggu']
            );

            $urutanBerikut = (int) RouteStop::where('courier_route_id', $route->id)->max('urutan') + 1;

            $stop = RouteStop::updateOrCreate(
                ['order_id' => $order->id],
                ['courier_route_id' => $route->id, 'urutan' => $urutanBerikut, 'status' => 'menunggu']
            );

            $order->update(['courier_id' => $courier->id]);

            return $stop;
        });
    }

    private function log(Order $order, string $status, ?string $keterangan = null, ?int $userId = null): void
    {
        $order->statusLogs()->create([
            'status'     => $status,
            'keterangan' => $keterangan,
            'changed_by' => $userId,
        ]);
    }
}
