<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CatalogController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->where('status', 'aktif')
            ->with('category')
            ->when($request->kategori, function ($q, $kategoriSlug) {
                $q->whereHas('category', fn ($q2) => $q2->where('slug', $kategoriSlug));
            })
            ->when($request->satuan, fn ($q, $satuan) => $q->where('satuan', $satuan))
            ->when($request->boolean('hanya_stok_tersedia'), fn ($q) => $q->where('stok', '>', 0))
            ->when($request->q, fn ($q, $search) => $q->where('nama', 'like', "%{$search}%"))
            ->when($request->urutan && $request->urutan !== 'paling_laris', function ($q) use ($request) {
                match ($request->urutan) {
                    'harga_rendah' => $q->orderBy('harga_jual', 'asc'),
                    'harga_tinggi' => $q->orderBy('harga_jual', 'desc'),
                    default        => $q->latest(),
                };
            }, function ($q) {
                // Default = "Paling Laris": urut dari total qty terjual (pesanan batal tidak dihitung).
                $q->withSum(['orderItems as terjual' => function ($oi) {
                    $oi->whereHas('order', fn ($o) => $o->where('status_pesanan', '!=', 'dibatalkan'));
                }], 'qty')
                ->orderByDesc('terjual')
                ->latest();
            })
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Customer/Catalog/Index', [
            'products' => $products,
            'categories' => Category::where('status_aktif', true)->orderBy('urutan')->get(['nama', 'slug', 'icon']),
            'filters' => $request->only(['kategori', 'satuan', 'hanya_stok_tersedia', 'urutan', 'q']),
        ]);
    }
}
