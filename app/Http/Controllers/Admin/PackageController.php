<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Package;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class PackageController extends Controller
{
    public function index(Request $request): Response
    {
        $packages = Package::withCount('items')
            ->when($request->search, fn ($q, $s) => $q->where('nama', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Packages/Index', ['packages' => $packages, 'filters' => $request->only('search')]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package'       => null,
            'produkTersedia'=> Product::where('status', 'aktif')->orderBy('nama')->get(['id', 'nama', 'satuan', 'harga_jual']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);
        $data['slug'] = $this->uniqueSlug($data['nama']);
        $data['status'] = $request->boolean('aktif') ? 'aktif' : 'nonaktif';

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('packages', 'public');
        }

        $items = $data['items'];
        unset($data['items']);

        $package = Package::create($data);
        $this->syncItems($package, $items);

        return redirect()->route('admin.paket.index')->with('success', "Paket \"{$package->nama}\" berhasil ditambahkan.");
    }

    public function edit(Package $package): Response
    {
        return Inertia::render('Admin/Packages/Form', [
            'package'        => $package->load('items.product:id,nama,satuan,harga_jual'),
            'produkTersedia' => Product::where('status', 'aktif')->orderBy('nama')->get(['id', 'nama', 'satuan', 'harga_jual']),
        ]);
    }

    public function update(Request $request, Package $package): RedirectResponse
    {
        $data = $this->validatedData($request);

        if ($data['nama'] !== $package->nama) {
            $data['slug'] = $this->uniqueSlug($data['nama'], $package->id);
        }

        $data['status'] = $request->boolean('aktif') ? 'aktif' : 'nonaktif';

        if ($request->hasFile('gambar')) {
            if ($package->gambar) {
                Storage::disk('public')->delete($package->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('packages', 'public');
        }

        $items = $data['items'];
        unset($data['items']);

        $package->update($data);

        // Cara paling sederhana & aman untuk sinkronisasi isi paket: hapus semua baris lama, buat ulang.
        // Package biasanya cuma berisi 2-4 produk, jadi tidak masalah secara performa.
        $package->items()->delete();
        $this->syncItems($package, $items);

        return redirect()->route('admin.paket.index')->with('success', "Paket \"{$package->nama}\" berhasil diperbarui.");
    }

    public function destroy(Package $package): RedirectResponse
    {
        if ($package->gambar) {
            Storage::disk('public')->delete($package->gambar);
        }
        $package->delete(); // package_items ikut terhapus otomatis (cascadeOnDelete di migration)

        return back()->with('success', "Paket \"{$package->nama}\" dihapus.");
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'nama'         => ['required', 'string', 'max:255'],
            'deskripsi'    => ['nullable', 'string', 'max:500'],
            'harga_diskon' => ['required', 'numeric', 'min:0'],
            'harga_coret'  => ['nullable', 'numeric', 'min:0', 'gt:harga_diskon'],
            'badge'        => ['nullable', 'string', 'max:50'],
            'gambar'       => ['nullable', 'image', 'max:2048'],
            'items'                 => ['required', 'array', 'min:1'],
            'items.*.product_id'    => ['required', 'exists:products,id'],
            'items.*.qty'           => ['required', 'integer', 'min:1'],
        ], [
            'items.required' => 'Pilih minimal 1 produk untuk isi paket.',
            'harga_coret.gt' => 'Harga coret harus lebih besar dari harga diskon (supaya terlihat sebagai potongan harga).',
        ]);
    }

    private function syncItems(Package $package, array $items): void
    {
        foreach ($items as $item) {
            $package->items()->create(['product_id' => $item['product_id'], 'qty' => $item['qty']]);
        }
    }

    private function uniqueSlug(string $nama, ?int $ignoreId = null): string
    {
        $slug = Str::slug($nama);
        $original = $slug;
        $i = 1;
        while (Package::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }
        return $slug;
    }
}
