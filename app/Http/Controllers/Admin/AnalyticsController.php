<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashReconciliation;
use App\Models\Courier;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AnalyticsController extends Controller
{
    public function index(Request $request): Response
    {
        $hari = (int) ($request->periode ?? 7);
        $hari = in_array($hari, [7, 30], true) ? $hari : 7;

        $dari   = now()->subDays($hari - 1)->startOfDay();
        $sampai = now()->endOfDay();

        // Satu query besar di-reuse untuk semua breakdown di bawah (tren, produk, kloter, kurir)
        // supaya tidak query berulang-ulang ke tabel orders untuk tiap bagian.
        $ordersLunas = Order::where('status_pembayaran', 'lunas')
            ->whereBetween('created_at', [$dari, $sampai])
            ->get(['id', 'total', 'created_at', 'delivery_batch_id', 'courier_id', 'user_id']);

        $trenOmzet = $this->trenOmzetHarian($ordersLunas, $hari);

        $produkTerlaris = OrderItem::selectRaw('product_id, nama_produk_snapshot, SUM(qty) as total_qty, SUM(subtotal) as total_omzet')
            ->whereIn('order_id', $ordersLunas->pluck('id'))
            ->groupBy('product_id', 'nama_produk_snapshot')
            ->orderByDesc('total_qty')
            ->limit(10)
            ->get();

        $performaKloter = DeliveryBatch::orderBy('urutan')->get()->map(function ($batch) use ($ordersLunas) {
            $ordersBatch = $ordersLunas->where('delivery_batch_id', $batch->id);

            return [
                'nama_kloter'    => $batch->nama_kloter,
                'jumlah_pesanan' => $ordersBatch->count(),
                'omzet'          => (float) $ordersBatch->sum('total'),
            ];
        });

        $performaKurir = Courier::where('status_aktif', true)->get()
            ->map(function ($courier) use ($ordersLunas, $dari, $sampai) {
                $ordersKurir = $ordersLunas->where('courier_id', $courier->id);

                $selisihRata = CashReconciliation::where('courier_id', $courier->id)
                    ->whereBetween('tanggal', [$dari->toDateString(), $sampai->toDateString()])
                    ->avg('selisih');

                return [
                    'nama'             => $courier->nama,
                    'jumlah_pesanan'   => $ordersKurir->count(),
                    'omzet_diantar'    => (float) $ordersKurir->sum('total'),
                    'rata_selisih_kas' => $selisihRata !== null ? (float) $selisihRata : null,
                ];
            })
            ->filter(fn ($k) => $k['jumlah_pesanan'] > 0)
            ->values();

        return Inertia::render('Admin/Analytics/Index', [
            'periode'        => $hari,
            'trenOmzet'      => $trenOmzet,
            'produkTerlaris' => $produkTerlaris,
            'performaKloter' => $performaKloter,
            'performaKurir'  => $performaKurir,
            'ringkasan'      => [
                'total_omzet'       => (float) $ordersLunas->sum('total'),
                'total_pesanan'     => $ordersLunas->count(),
                'rata_rata_pesanan' => $ordersLunas->count() > 0 ? (float) $ordersLunas->avg('total') : 0,
                'pelanggan_aktif'   => $ordersLunas->pluck('user_id')->unique()->count(),
                'pelanggan_baru'    => User::where('role', 'customer')->whereBetween('created_at', [$dari, $sampai])->count(),
            ],
        ]);
    }

    /** Isi 0 untuk hari tanpa transaksi, supaya grafik batang tidak "bolong" tanggalnya. */
    private function trenOmzetHarian($ordersLunas, int $hari)
    {
        $perHari = $ordersLunas->groupBy(fn ($o) => $o->created_at->toDateString())
            ->map(fn ($g) => ['omzet' => (float) $g->sum('total'), 'jumlah' => $g->count()]);

        $hasil = collect();
        for ($i = 0; $i < $hari; $i++) {
            $tanggal = now()->subDays($hari - 1 - $i)->toDateString();
            $hasil->push([
                'tanggal' => $tanggal,
                'omzet'   => $perHari[$tanggal]['omzet'] ?? 0,
                'jumlah'  => $perHari[$tanggal]['jumlah'] ?? 0,
            ]);
        }

        return $hasil;
    }
}
