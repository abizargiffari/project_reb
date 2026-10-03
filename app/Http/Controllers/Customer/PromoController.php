<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PromoController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customer/Promo/Index', [
            'banners' => Banner::aktif()->orderBy('urutan')->get(),
            'produk'  => Product::where('status', 'aktif')
                ->whereNotNull('harga_coret')
                ->with('category:id,nama')
                ->latest()
                ->get(),
        ]);
    }
}
