<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use App\Models\DeliveryBatch;
use App\Models\Package;
use App\Models\Product;
use App\Models\Testimonial;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customer/Home', [
            'banners' => Banner::aktif()->orderBy('urutan')->get(),
            'deliveryBatches' => DeliveryBatch::where('status_aktif', true)->orderBy('urutan')->get(),
            'featuredProducts' => Product::where('status', 'aktif')->with('category')->latest()->limit(8)->get(),
            'packages' => Package::where('status', 'aktif')->limit(3)->get(),
            'testimonials' => Testimonial::where('status_tampil', true)->latest()->limit(2)->get(),
        ]);
    }
}
