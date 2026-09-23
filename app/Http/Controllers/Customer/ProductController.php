<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function show(Product $product): Response
    {
        abort_if($product->status !== 'aktif', 404);

        $produkTerkait = Product::where('category_id', $product->category_id)
            ->where('id', '!=', $product->id)
            ->where('status', 'aktif')
            ->inRandomOrder()
            ->limit(4)
            ->get();

        return Inertia::render('Customer/Product/Show', [
            'product' => $product->load('category', 'images'),
            'produkTerkait' => $produkTerkait,
        ]);
    }
}
