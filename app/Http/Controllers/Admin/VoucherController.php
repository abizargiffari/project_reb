<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Voucher;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class VoucherController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Vouchers/Index', [
            'vouchers' => Voucher::latest()->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validated($request);
        $data['kode'] = strtoupper(trim($data['kode']));

        // unique dicek setelah di-uppercase, supaya "hemat5" dan "HEMAT5" tidak lolos jadi dua voucher.
        if (Voucher::where('kode', $data['kode'])->exists()) {
            return back()->withErrors(['kode' => 'Kode voucher ini sudah dipakai.'])->withInput();
        }

        Voucher::create([...$data, 'terpakai' => 0]);

        return back()->with('success', "Voucher {$data['kode']} berhasil dibuat.");
    }

    public function update(Request $request, Voucher $voucher): RedirectResponse
    {
        $data = $this->validated($request, $voucher->id);
        $data['kode'] = strtoupper(trim($data['kode']));

        if (Voucher::where('kode', $data['kode'])->where('id', '!=', $voucher->id)->exists()) {
            return back()->withErrors(['kode' => 'Kode voucher ini sudah dipakai.']);
        }

        // Kuota tidak boleh diturunkan di bawah jumlah yang sudah terpakai.
        if (!empty($data['kuota']) && $data['kuota'] < $voucher->terpakai) {
            return back()->withErrors(['kuota' => "Kuota tidak boleh kurang dari {$voucher->terpakai} (jumlah yang sudah terpakai)."]);
        }

        $voucher->update($data);

        return back()->with('success', "Voucher {$voucher->kode} diperbarui.");
    }

    public function destroy(Voucher $voucher): RedirectResponse
    {
        // orders.voucher_id = nullOnDelete: menghapus voucher yang sudah dipakai akan MENGOSONGKAN
        // voucher_id di pesanan lama (riwayat diskon hilang). Jadi yang sudah dipakai hanya boleh dinonaktifkan.
        if ($voucher->orders()->exists() || $voucher->terpakai > 0) {
            return back()->with('error', 'Voucher ini sudah pernah dipakai pada pesanan, jadi tidak bisa dihapus. Nonaktifkan saja.');
        }

        $voucher->delete();

        return back()->with('success', 'Voucher dihapus.');
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        $data = $request->validate([
            'kode'            => ['required', 'string', 'max:50', 'regex:/^[A-Za-z0-9_-]+$/'],
            'tipe'            => ['required', Rule::in(['nominal', 'persen'])],
            'nilai'           => ['required', 'numeric', 'min:1'],
            'minimal_belanja' => ['nullable', 'numeric', 'min:0'],
            'kuota'           => ['nullable', 'integer', 'min:1'],
            'berlaku_dari'    => ['nullable', 'date'],
            'berlaku_sampai'  => ['nullable', 'date', 'after_or_equal:berlaku_dari'],
            'status_aktif'    => ['boolean'],
        ], [
            'kode.regex' => 'Kode hanya boleh berisi huruf, angka, strip (-), dan garis bawah (_), tanpa spasi.',
        ]);

        if ($data['tipe'] === 'persen' && $data['nilai'] > 100) {
            abort(back()->withErrors(['nilai' => 'Diskon persen tidak boleh lebih dari 100.']));
        }

        return $data;
    }
}
