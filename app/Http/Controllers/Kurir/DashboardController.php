<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;

class DashboardController extends Controller
{
    // Modul Kas (Modul 5) akan menjadikan ini dashboard ringkasan sungguhan.
    // Untuk sekarang, halaman kerja utama kurir adalah daftar rute pengantaran.
    public function index(): RedirectResponse
    {
        return redirect()->route('kurir.route.index');
    }
}
