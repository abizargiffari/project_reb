<?php

namespace App\Http\Middleware;

use App\Models\CartItem;
use App\Models\ContactMessage;
use App\Models\Setting;
use App\Models\Wishlist;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
            ],
            'cartCount' => fn () => $request->user()
                ? (int) CartItem::whereHas('cart', fn ($q) => $q->where('user_id', $request->user()->id))->sum('qty')
                : 0,

            // Data toko untuk footer/halaman kontak — diatur admin di Pengaturan Lapak.
            'toko' => fn () => Setting::publik(),

            // ID produk yang sudah di-wishlist pengguna, supaya ikon hati di setiap kartu produk
            // langsung tahu statusnya tanpa query tambahan per kartu.
            'wishlistIds' => fn () => $request->user()
                ? Wishlist::where('user_id', $request->user()->id)->pluck('product_id')->all()
                : [],

            // Angka kecil di menu admin "Pesan Masuk". Hanya dihitung untuk admin.
            'unreadMessages' => fn () => $request->user()?->role === 'admin'
                ? ContactMessage::where('status', 'baru')->count()
                : 0,
        ];
    }
}
