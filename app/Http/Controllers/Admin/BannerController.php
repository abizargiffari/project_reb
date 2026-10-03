<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class BannerController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Banners/Index', ['banners' => Banner::orderBy('urutan')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'judul'          => ['required', 'string', 'max:150'],
            'gambar'         => ['required', 'image', 'max:3072'],
            'link'           => ['nullable', 'string', 'max:255'],
            'posisi'         => ['nullable', 'string', 'max:50'],
            'tanggal_mulai'  => ['nullable', 'date'],
            'tanggal_selesai'=> ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
        ]);

        $data['gambar'] = $request->file('gambar')->store('banners', 'public');
        $data['status_aktif'] = true;
        $data['urutan'] = (int) (Banner::max('urutan') ?? 0) + 1;

        Banner::create($data);

        return back()->with('success', 'Banner ditambahkan.');
    }

    public function update(Request $request, Banner $banner): RedirectResponse
    {
        $data = $request->validate([
            'judul'          => ['required', 'string', 'max:150'],
            'gambar'         => ['nullable', 'image', 'max:3072'],
            'link'           => ['nullable', 'string', 'max:255'],
            'posisi'         => ['nullable', 'string', 'max:50'],
            'tanggal_mulai'  => ['nullable', 'date'],
            'tanggal_selesai'=> ['nullable', 'date', 'after_or_equal:tanggal_mulai'],
            'status_aktif'   => ['boolean'],
        ]);

        if ($request->hasFile('gambar')) {
            if ($banner->gambar) {
                Storage::disk('public')->delete($banner->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('banners', 'public');
        }

        $banner->update($data);

        return back()->with('success', 'Banner diperbarui.');
    }

    public function destroy(Banner $banner): RedirectResponse
    {
        if ($banner->gambar) {
            Storage::disk('public')->delete($banner->gambar);
        }
        $banner->delete();

        return back()->with('success', 'Banner dihapus.');
    }
}
