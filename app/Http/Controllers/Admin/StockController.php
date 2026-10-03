<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->with('category:id,nama')
            ->when($request->search, fn ($q, $s) => $q->where(fn ($q2) => $q2->where('nama', 'like', "%{$s}%")->orWhere('sku', 'like', "%{$s}%")))
            ->when($request->category_id, fn ($q, $v) => $q->where('category_id', $v))
            ->when($request->boolean('hanya_kritis'), fn ($q) => $q->whereColumn('stok', '<=', 'stok_minimum'))
            ->orderBy('nama')
            ->paginate(15)
            ->withQueryString()
            ->through(fn (Product $p) => $p->append(['is_low_stock', 'margin_persen'])->makeVisible('harga_modal'));

        return Inertia::render('Admin/Stock/Index', [
            'products'   => $products,
            'categories' => Category::orderBy('urutan')->get(['id', 'nama']),
            'filters'    => $request->only(['search', 'category_id', 'hanya_kritis']),
            'ringkasan'  => [
                'total_produk' => Product::count(),
                'stok_kritis'  => Product::whereColumn('stok', '<=', 'stok_minimum')->count(),
                'nilai_stok'   => (float) Product::selectRaw('SUM(stok * harga_modal) as total')->value('total'),
            ],
            'riwayatTerkini' => StockMovement::with('product:id,nama', 'creator:id,name')
                ->latest()
                ->limit(15)
                ->get(),
        ]);
    }

    public function storeMovement(Request $request, Product $product): RedirectResponse
    {
        $data = $request->validate([
            'tipe'       => ['required', 'in:masuk,keluar,susut'],
            'qty'        => ['required', 'integer', 'min:1'],
            'keterangan' => ['nullable', 'string', 'max:255'],
        ]);

        if (in_array($data['tipe'], ['keluar', 'susut'], true) && $data['qty'] > $product->stok) {
            return back()->with('error', "Stok {$product->nama} hanya {$product->stok}, tidak bisa dikurangi {$data['qty']}.");
        }

        $sumberLabel = ['masuk' => 'Stok Masuk Manual', 'keluar' => 'Stok Keluar Manual', 'susut' => 'Susut/Rusak'];

        StockMovement::create([
            'product_id' => $product->id,
            'tipe'       => $data['tipe'],
            'qty'        => $data['qty'],
            'sumber'     => $sumberLabel[$data['tipe']],
            'keterangan' => $data['keterangan'] ?? null,
            'created_by' => $request->user()->id,
        ]);

        $product->increment('stok', $data['tipe'] === 'masuk' ? $data['qty'] : -$data['qty']);

        return back()->with('success', "Stok {$product->nama} berhasil diperbarui.");
    }
}
