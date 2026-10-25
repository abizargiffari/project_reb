<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class WishlistController extends Controller
{
    public function index(Request $request): Response
    {
        // Urutan = yang terakhir disimpan tampil paling atas.
        $ids = Wishlist::where('user_id', $request->user()->id)->latest()->pluck('product_id')->all();

        $produk = Product::whereIn('id', $ids)
            ->where('status', 'aktif')
            ->with('category:id,nama')
            ->get()
            ->sortBy(fn ($p) => array_search($p->id, $ids))
            ->values();

        return Inertia::render('Customer/Account/Wishlist', ['produk' => $produk]);
    }

    public function store(Request $request, Product $product): RedirectResponse
    {
        // firstOrCreate: klik ganda/dua tab tidak membuat baris dobel (ada unique index user_id+product_id).
        Wishlist::firstOrCreate(['user_id' => $request->user()->id, 'product_id' => $product->id]);

        return back()->with('success', "{$product->nama} disimpan ke wishlist.");
    }

    public function destroy(Request $request, Product $product): RedirectResponse
    {
        Wishlist::where('user_id', $request->user()->id)->where('product_id', $product->id)->delete();

        return back();
    }
}
