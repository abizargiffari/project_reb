<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TestimonialController extends Controller
{
    /**
     * Halaman "Ulasan Saya" di akun pelanggan. Testimoni TIDAK diikat ke pesanan tertentu
     * (tabel `testimonials` tidak punya kolom order_id) — ini ulasan umum tentang warung,
     * bukan ulasan per transaksi. Pelanggan bisa submit kapan saja setelah pernah belanja.
     */
    public function index(Request $request): Response
    {
        $sudahPernahBelanja = $request->user()->orders()->where('status_pembayaran', 'lunas')->exists();

        return Inertia::render('Customer/Account/Testimonials', [
            'ulasanSaya'          => Testimonial::where('user_id', $request->user()->id)->latest()->get(),
            'sudahPernahBelanja'  => $sudahPernahBelanja,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        if (!$request->user()->orders()->where('status_pembayaran', 'lunas')->exists()) {
            return back()->with('error', 'Ulasan hanya bisa diberikan oleh pelanggan yang sudah pernah berbelanja.');
        }

        $data = $request->validate([
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'isi'    => ['required', 'string', 'max:500'],
            'label'  => ['nullable', 'string', 'max:100'],
        ]);

        Testimonial::create([
            'user_id'      => $request->user()->id,
            'nama'         => $request->user()->name,
            'label'        => $data['label'] ?? null,
            'rating'       => $data['rating'],
            'isi'          => $data['isi'],
            'status_tampil'=> false, // menunggu moderasi admin sebelum tampil publik
        ]);

        return back()->with('success', 'Terima kasih! Ulasan Anda akan tampil di beranda setelah ditinjau tim kami.');
    }
}
