<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Hapus akun.
     *
     * PENTING — jangan langsung $user->delete() untuk pelanggan yang pernah belanja:
     * orders.user_id memakai cascadeOnDelete, jadi menghapus user akan ikut MENGHAPUS seluruh
     * pesanan, item, dan pembayarannya — omzet di laporan Keuangan & Analitik ikut berubah.
     * Untuk pelanggan yang punya riwayat pesanan, data pribadinya dianonimkan (nama, email,
     * telepon, kata sandi) tetapi barisnya dipertahankan sebagai catatan transaksi, sesuai
     * yang dijanjikan di halaman Kebijakan Privasi.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        if ($user->role !== 'customer') {
            return back()->withErrors(['password' => 'Akun admin/kurir tidak bisa dihapus sendiri. Hubungi admin utama.']);
        }

        Auth::logout();

        DB::transaction(function () use ($user) {
            if ($user->orders()->exists()) {
                // Alamat yang dipakai pesanan harus tetap ada (restrictOnDelete); sisanya dibersihkan.
                $user->addresses()->whereDoesntHave('orders')->delete();
                $user->wishlists()->delete();
                $user->cart?->delete();

                $user->forceFill([
                    'name'              => 'Pelanggan (akun dihapus)',
                    'email'             => "dihapus-{$user->id}@akun-dihapus.invalid",
                    'phone'             => null,
                    'avatar'            => null,
                    'password'          => Str::random(60),
                    'remember_token'    => null,
                    'email_verified_at' => null,
                ])->save();
            } else {
                $user->delete();
            }
        });

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
