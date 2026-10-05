<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
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
}
