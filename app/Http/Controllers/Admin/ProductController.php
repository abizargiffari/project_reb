<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Category;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(\Illuminate\Http\Request $request): Response
    {
        $products = Product::query()
            ->with('category')
            ->when($request->search, fn ($q, $search) => $q->where(function ($q2) use ($search) {
                $q2->where('nama', 'like', "%{$search}%")
                ->orWhere('sku', 'like', "%{$search}%");
            }))
            ->when($request->category_id, fn ($q, $categoryId) => $q->where('category_id', $categoryId))
            ->when($request->status, fn ($q, $status) => $q->where('status', $status))
            ->when($request->stok_kritis, fn ($q) => $q->whereColumn('stok', '<=', 'stok_minimum'))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
            'categories' => Category::orderBy('urutan')->get(['id', 'nama']),
            'filters' => $request->only(['search', 'category_id', 'status', 'stok_kritis']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::orderBy('urutan')->get(['id', 'nama']),
            'product' => null,
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $data = $request->validated();
        $data['slug'] = $this->generateUniqueSlug($data['nama']);
        $data['sku'] = strtoupper(Str::random(8));

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('products', 'public');
        }

        $product = Product::create($data);

        // Catat sebagai stok masuk awal, bukan cuma set kolom stok langsung
        if ($data['stok'] > 0) {
            StockMovement::create([
                'product_id' => $product->id,
                'tipe' => 'masuk',
                'qty' => $data['stok'],
                'sumber' => 'Input Produk Baru',
                'created_by' => Auth::id(),
            ]);
        }

        return redirect()->route('admin.produk.index')->with('success', "Produk \"{$product->nama}\" berhasil ditambahkan.");
    }

    public function edit(Product $product): Response
    {
        return Inertia::render('Admin/Products/Form', [
            'categories' => Category::orderBy('urutan')->get(['id', 'nama']),
            'product' => $product,
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $data = $request->validated();

        if ($data['nama'] !== $product->nama) {
            $data['slug'] = $this->generateUniqueSlug($data['nama'], $product->id);
        }

        $stokLama = $product->stok;

        if ($request->hasFile('gambar')) {
            if ($product->gambar) {
                Storage::disk('public')->delete($product->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('products', 'public');
        }

        $product->update($data);

        // Kalau admin mengubah angka stok manual lewat form edit, catat sebagai penyesuaian
        $selisih = $data['stok'] - $stokLama;
        if ($selisih !== 0) {
            StockMovement::create([
                'product_id' => $product->id,
                'tipe' => $selisih > 0 ? 'masuk' : 'keluar',
                'qty' => abs($selisih),
                'sumber' => 'Penyesuaian Manual via Form Edit',
                'created_by' => Auth::id(),
            ]);
        }

        return redirect()->route('admin.produk.index')->with('success', "Produk \"{$product->nama}\" berhasil diperbarui.");
    }

    public function destroy(Product $product): RedirectResponse
    {
        // Soft delete saja — gambar & histori tetap disimpan untuk laporan lama
        $product->delete();

        return redirect()->route('admin.produk.index')->with('success', "Produk \"{$product->nama}\" telah dinonaktifkan.");
    }

    private function generateUniqueSlug(string $nama, ?int $ignoreId = null): string
    {
        $slug = Str::slug($nama);
        $original = $slug;
        $i = 1;

        while (Product::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }

        return $slug;
    }
}
