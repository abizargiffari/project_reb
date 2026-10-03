<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    public function index(Request $request): Response
    {
        $testimonials = Testimonial::when($request->status === 'tampil', fn ($q) => $q->where('status_tampil', true))
            ->when($request->status === 'menunggu', fn ($q) => $q->where('status_tampil', false))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Testimonials/Index', ['testimonials' => $testimonials, 'filters' => $request->only('status')]);
    }

    /** Admin bisa juga menambah testimoni manual (hasil WA/lisan pelanggan), bukan hanya moderasi. */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama'   => ['required', 'string', 'max:100'],
            'label'  => ['nullable', 'string', 'max:100'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'isi'    => ['required', 'string', 'max:500'],
            'catatan'=> ['nullable', 'string', 'max:100'],
        ]);

        Testimonial::create([...$data, 'status_tampil' => true]);

        return back()->with('success', 'Testimoni ditambahkan.');
    }

    public function toggleTampil(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->update(['status_tampil' => !$testimonial->status_tampil]);

        return back()->with('success', $testimonial->status_tampil ? 'Testimoni ditampilkan di beranda.' : 'Testimoni disembunyikan dari beranda.');
    }

    public function destroy(Testimonial $testimonial): RedirectResponse
    {
        $testimonial->delete();

        return back()->with('success', 'Testimoni dihapus.');
    }
}
