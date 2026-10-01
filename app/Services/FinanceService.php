<?php

namespace App\Services;

use App\Models\CashTransaction;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Support\Facades\DB;

class FinanceService
{
    /**
     * Ringkasan laba/rugi untuk satu rentang tanggal.
     *
     * Definisi yang dipakai (penting untuk konsistensi, supaya tidak dobel hitung):
     * - Omzet      = total pesanan yang SUDAH LUNAS, dari tabel `orders` (bukan dari cash_transactions).
     * - Modal/HPP  = harga_modal x qty untuk setiap item di pesanan lunas tsb.
     * - Biaya/Pemasukan manual lain = HANYA dari `cash_transactions` (kulakan tambahan, kantong bio, dsb).
     *   Admin TIDAK boleh mencatat ulang penjualan online sebagai transaksi kas manual, karena
     *   penjualan sudah otomatis terhitung lewat Omzet di atas — mencatat ulang akan dobel hitung.
     */
    public function summary(string $dari, string $sampai): array
    {
        $ordersLunas = Order::where('status_pembayaran', 'lunas')
            ->whereBetween('created_at', ["{$dari} 00:00:00", "{$sampai} 23:59:59"])
            ->get(['id', 'total']);

        $omzet = (float) $ordersLunas->sum('total');

        $modal = (float) OrderItem::whereIn('order_id', $ordersLunas->pluck('id'))
            ->join('products', 'products.id', '=', 'order_items.product_id')
            ->sum(DB::raw('order_items.qty * products.harga_modal'));

        $biayaKeluar   = (float) CashTransaction::whereBetween('tanggal', [$dari, $sampai])->where('tipe', 'keluar')->sum('nominal');
        $pemasukanLain = (float) CashTransaction::whereBetween('tanggal', [$dari, $sampai])->where('tipe', 'masuk')->sum('nominal');

        return [
            'omzet'               => $omzet,
            'modal'               => $modal,
            'laba_kotor'          => $omzet - $modal,
            'biaya_keluar'        => $biayaKeluar,
            'pemasukan_lain'      => $pemasukanLain,
            'laba_bersih'         => $omzet - $modal - $biayaKeluar + $pemasukanLain,
            'jumlah_pesanan_lunas'=> $ordersLunas->count(),
        ];
    }
}
