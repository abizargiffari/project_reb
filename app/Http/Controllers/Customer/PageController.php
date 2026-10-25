<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\DeliveryBatch;
use App\Models\Setting;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    /**
     * Halaman "Tentang Kami" perlu data toko yang dinamis (nama, alamat, dsb dari Modul 7),
     * makanya diberi controller sendiri — beda dengan Syarat & Ketentuan / Kebijakan Privasi
     * yang isinya murni teks tetap, jadi cukup closure render biasa tanpa controller.
     */
    public function about(): Response
    {
        return Inertia::render('Customer/Static/About', [
            'toko' => [
                'nama'         => Setting::get('store_name', 'Warung Sayur Pulungan'),
                'tagline'      => Setting::get('store_tagline', ''),
                'alamat'       => Setting::get('store_address', ''),
                'telepon'      => Setting::get('store_phone', ''),
                'jam_operasional' => Setting::get('store_open_hours', ''),
                'area_layanan' => Setting::get('area_layanan', ''),
            ],
        ]);
    }

    /**
     * "Cara Pemesanan" sekaligus menjelaskan pilihan pengiriman (kloter) dan metode pembayaran.
     * Angka ongkir & kloter diambil dari database/Pengaturan Lapak, jadi otomatis ikut berubah
     * kalau admin mengganti aturan — tidak ada angka yang di-hardcode di halaman.
     */
    public function howToOrder(): Response
    {
        return Inertia::render('Customer/Static/HowToOrder', [
            'kloter'              => DeliveryBatch::where('status_aktif', true)->orderBy('urutan')->get(),
            'ongkir'              => (int) Setting::get('ongkir_flat', 2000),
            'gratisOngkirMinimal' => (int) Setting::get('gratis_ongkir_minimal', 30000),
            'biayaKantong'        => (int) Setting::get('biaya_kantong', 500),
        ]);
    }
}
