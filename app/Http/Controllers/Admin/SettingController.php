<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryBatch;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    /** Daftar key setting yang dikelola dari halaman ini (sumber kebenaran tunggal, dipakai index() & update()). */
    private const KEYS = [
        'store_name', 'store_tagline', 'store_address', 'store_phone', 'store_open_hours',
        'payment_bank_name', 'payment_bank_number', 'payment_bank_holder', 'payment_qris_status',
        'ongkir_flat', 'gratis_ongkir_minimal', 'biaya_kantong', 'area_layanan',
    ];

    public function index(): Response
    {
        $settings = collect(self::KEYS)->mapWithKeys(fn ($key) => [$key => Setting::get($key, '')]);

        return Inertia::render('Admin/Settings/Index', [
            'settings' => $settings,
            'batches'  => DeliveryBatch::orderBy('urutan')->get(),
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'store_name'          => ['required', 'string', 'max:150'],
            'store_tagline'       => ['nullable', 'string', 'max:200'],
            'store_address'       => ['nullable', 'string', 'max:500'],
            'store_phone'         => ['nullable', 'string', 'max:30'],
            'store_open_hours'    => ['nullable', 'string', 'max:100'],
            'payment_bank_name'   => ['nullable', 'string', 'max:50'],
            'payment_bank_number' => ['nullable', 'string', 'max:50'],
            'payment_bank_holder' => ['nullable', 'string', 'max:100'],
            'payment_qris_status' => ['nullable', 'string', 'max:50'],
            'ongkir_flat'         => ['required', 'numeric', 'min:0'],
            'gratis_ongkir_minimal' => ['required', 'numeric', 'min:0'],
            'biaya_kantong'       => ['required', 'numeric', 'min:0'],
            'area_layanan'        => ['nullable', 'string', 'max:255'],
        ]);

        foreach ($data as $key => $value) {
            Setting::set($key, (string) $value);
        }

        return back()->with('success', 'Pengaturan lapak berhasil disimpan.');
    }

    public function storeBatch(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama_kloter'  => ['required', 'string', 'max:100'],
            'jam_mulai'    => ['required'],
            'jam_selesai'  => ['required'],
            'kuota'        => ['required', 'integer', 'min:1'],
            'badge_status' => ['nullable', 'string', 'max:50'],
        ]);

        DeliveryBatch::create([
            ...$data,
            'terpakai'     => 0,
            'status_aktif' => true,
            'urutan'       => (int) (DeliveryBatch::max('urutan') ?? 0) + 1,
        ]);

        return back()->with('success', 'Kloter baru ditambahkan.');
    }

    public function updateBatch(Request $request, DeliveryBatch $batch): RedirectResponse
    {
        $data = $request->validate([
            'nama_kloter'  => ['required', 'string', 'max:100'],
            'jam_mulai'    => ['required'],
            'jam_selesai'  => ['required'],
            'kuota'        => ['required', 'integer', 'min:1'],
            'badge_status' => ['nullable', 'string', 'max:50'],
            'status_aktif' => ['boolean'],
        ]);

        // Kuota tidak boleh diturunkan sampai di bawah slot yang HARI INI sudah terpakai,
        // supaya pesanan yang sudah terlanjur masuk tidak tiba-tiba "melebihi kuota".
        if ($data['kuota'] < $batch->terpakai) {
            return back()->withErrors([
                'kuota' => "Kuota tidak boleh kurang dari {$batch->terpakai} (jumlah slot yang sudah terpakai hari ini).",
            ]);
        }

        $batch->update($data);

        return back()->with('success', 'Kloter berhasil diperbarui.');
    }

    public function destroyBatch(DeliveryBatch $batch): RedirectResponse
    {
        if ($batch->orders()->exists()) {
            return back()->with('error', 'Kloter tidak bisa dihapus karena sudah punya riwayat pesanan. Nonaktifkan saja lewat toggle status.');
        }

        $batch->delete();

        return back()->with('success', 'Kloter dihapus.');
    }
}
