<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\StoreCheckoutRequest;
use App\Models\Cart;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function __construct(
        private OrderService $orders,
        private MidtransService $midtrans,
    ) {}

    public function index(Request $request): Response|RedirectResponse
    {
        $user = $request->user();
        $cart = Cart::firstOrCreate(['user_id' => $user->id]);
        $cart->load('items.product');

        if ($cart->items->isEmpty()) {
            return redirect()->route('cart.index')->with('error', 'Keranjang masih kosong.');
        }

        $summary = $this->orders->summary($cart, $request->query('voucher'));
        $address = $user->defaultAddress ?? $user->addresses()->latest()->first();

        return Inertia::render('Customer/Checkout/Index', [
            'items' => $cart->items->map(fn ($i) => [
                'id'         => $i->id,
                'qty'        => $i->qty,
                'nama'       => $i->product->nama,
                'gambar'     => $i->product->gambar,
                'harga_jual' => $i->product->harga_jual,
                'subtotal'   => $i->qty * $i->product->harga_jual,
            ]),
            'summary' => [
                'subtotal'         => $summary['subtotal'],
                'ongkir'           => $summary['ongkir'],
                'ongkir_asli'      => $summary['ongkir_asli'],
                'biaya_kantong'    => $summary['biaya_kantong'],
                'potongan_voucher' => $summary['potongan_voucher'],
                'total'            => $summary['total'],
            ],
            'voucher'      => $summary['voucher'] ? ['kode' => $summary['voucher']->kode, 'potongan' => $summary['potongan_voucher']] : null,
            'voucherError' => $summary['voucher_error'],
            'batches'      => DeliveryBatch::where('status_aktif', true)->orderBy('urutan')->get(),
            'prefill'      => [
                'nama_penerima'    => $address->nama_penerima ?? $user->name,
                'telepon_penerima' => $address->telepon_penerima ?? $user->phone,
                'alamat_lengkap'   => $address->alamat_lengkap ?? '',
                'catatan_patokan'  => $address->catatan_patokan ?? '',
            ],
        ]);
    }

    public function store(StoreCheckoutRequest $request): RedirectResponse
    {
        $cart = Cart::where('user_id', $request->user()->id)->firstOrFail();

        // Jika stok/kuota bermasalah, OrderService melempar ValidationException:
        // Laravel otomatis mengembalikan pelanggan ke form dengan pesan error.
        $order = $this->orders->place($request->user(), $cart, $request->validated());

        return redirect()->route('checkout.success', $order);
    }

    public function success(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load('items', 'address', 'deliveryBatch');

        $snapToken = null;
        $snapError = null;

        $perluBayarOnline = $order->metode_bayar !== 'cod'
            && $order->status_pembayaran === 'pending'
            && $order->status_pesanan !== 'dibatalkan';

        if ($perluBayarOnline) {
            $payment = $order->payments()->latest()->first();
            $snapToken = $payment?->raw_response['snap_token'] ?? null;

            if (!$snapToken && $payment) {
                try {
                    $snapToken = $this->midtrans->createSnapToken($order);
                    // Disimpan & dipakai ulang: order_id Midtrans hanya boleh dipakai sekali.
                    $payment->update(['raw_response' => array_merge($payment->raw_response ?? [], ['snap_token' => $snapToken])]);
                } catch (\Throwable $e) {
                    report($e);
                    $snapError = 'Gagal menyiapkan pembayaran online. Pesanan tetap tersimpan, silakan coba lagi.';
                }
            }
        }

        return Inertia::render('Customer/Checkout/Success', [
            'order' => [
                'id'                    => $order->id,
                'order_number'          => $order->order_number,
                'metode_bayar'          => $order->metode_bayar,
                'status_pembayaran'     => $order->status_pembayaran,
                'status_pesanan'        => $order->status_pesanan,
                'subtotal'              => $order->subtotal,
                'ongkir'                => $order->ongkir,
                'biaya_kantong'         => $order->biaya_kantong,
                'potongan_voucher'      => $order->potongan_voucher,
                'total'                 => $order->total,
                'cod_nominal_disiapkan' => $order->cod_nominal_disiapkan,
                'kloter'                => $order->deliveryBatch?->nama_kloter,
                'jam_mulai'             => $order->deliveryBatch?->jam_mulai,
                'jam_selesai'           => $order->deliveryBatch?->jam_selesai,
                'penerima'              => $order->address?->nama_penerima,
                'alamat'                => $order->address?->alamat_lengkap,
                'items'                 => $order->items->map(fn ($i) => [
                    'id' => $i->id, 'nama' => $i->nama_produk_snapshot, 'qty' => $i->qty, 'subtotal' => $i->subtotal,
                ]),
            ],
            'snapToken'    => $snapToken,
            'snapError'    => $snapError,
            'clientKey'    => config('midtrans.client_key'),
            'isProduction' => config('midtrans.is_production'),
        ]);
    }
}
