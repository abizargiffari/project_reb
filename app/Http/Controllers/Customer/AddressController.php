<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Address;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AddressController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Customer/Account/Addresses', [
            'addresses' => Address::where('user_id', $request->user()->id)
                ->withCount('orders')
                ->orderByDesc('is_default')
                ->latest()
                ->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $userId = $request->user()->id;

        // Alamat pertama otomatis jadi alamat utama.
        $jadiUtama = ($data['is_default'] ?? false) || !Address::where('user_id', $userId)->exists();
        if ($jadiUtama) {
            Address::where('user_id', $userId)->update(['is_default' => false]);
        }

        Address::create([...$data, 'user_id' => $userId, 'is_default' => $jadiUtama]);

        return back()->with('success', 'Alamat berhasil ditambahkan.');
    }

    public function update(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);
        $data = $this->validated($request);

        if ($data['is_default'] ?? false) {
            Address::where('user_id', $address->user_id)->where('id', '!=', $address->id)->update(['is_default' => false]);
        } else {
            $data['is_default'] = $address->is_default; // tidak boleh "mematikan" utama lewat form; ganti utama lewat tombol di alamat lain
        }

        $address->update($data);

        return back()->with('success', 'Alamat berhasil diperbarui.');
    }

    public function setDefault(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);

        Address::where('user_id', $address->user_id)->update(['is_default' => false]);
        $address->update(['is_default' => true]);

        return back()->with('success', 'Alamat utama diganti.');
    }

    public function destroy(Request $request, Address $address): RedirectResponse
    {
        $this->authorizeOwner($request, $address);

        // orders.address_id memakai restrictOnDelete: alamat yang pernah dipakai pesanan tidak boleh
        // dihapus (riwayat pengiriman harus tetap utuh). Beri pesan jelas, bukan error 500.
        if ($address->orders()->exists()) {
            return back()->with('error', 'Alamat ini pernah dipakai pada pesanan, jadi tidak bisa dihapus. Anda bisa mengubahnya atau menjadikan alamat lain sebagai utama.');
        }

        $address->delete();

        return back()->with('success', 'Alamat dihapus.');
    }

    private function validated(Request $request): array
    {
        return $request->validate([
            'label'            => ['required', 'string', 'max:50'],
            'nama_penerima'    => ['required', 'string', 'max:100'],
            'telepon_penerima' => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,12}$/'],
            'alamat_lengkap'   => ['required', 'string', 'max:500'],
            'catatan_patokan'  => ['nullable', 'string', 'max:300'],
            'is_default'       => ['boolean'],
        ], [
            'telepon_penerima.regex' => 'Nomor telepon/WhatsApp tidak valid. Contoh: 081234567890.',
        ]);
    }

    /** Mencegah pelanggan A mengubah/menghapus alamat pelanggan B dengan menebak ID. */
    private function authorizeOwner(Request $request, Address $address): void
    {
        abort_unless($address->user_id === $request->user()->id, 403);
    }
}
