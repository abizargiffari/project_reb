<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\CashTransaction;
use App\Models\ReturnRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ReturnController extends Controller
{
    public function index(Request $request): Response
    {
        $returns = ReturnRequest::query()
            ->with(['order:id,order_number,user_id', 'order.user:id,name', 'product:id,nama,harga_jual'])
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Returns/Index', [
            'returns' => $returns,
            'filters' => $request->only('status'),
        ]);
    }

    /**
     * Setujui/tolak pengajuan retur.
     *
     * Catatan desain: retur sayur yang disetujui TIDAK mengembalikan stok (barang rusak/busuk dibuang,
     * bukan dijual ulang) — sebagai gantinya dicatat sebagai kas keluar "Kerugian Retur", supaya
     * laporan laba/rugi di Modul 5 tetap akurat tanpa perlu admin mencatat manual dua kali.
     */
    public function update(Request $request, ReturnRequest $returnRequest): RedirectResponse
    {
        $data = $request->validate(['status' => ['required', 'in:disetujui,ditolak']]);

        if ($returnRequest->status !== 'diajukan') {
            return back()->with('error', 'Pengajuan ini sudah pernah diproses sebelumnya.');
        }

        $returnRequest->load('order', 'product');
        $returnRequest->update(['status' => $data['status']]);

        if ($data['status'] === 'disetujui') {
            $orderItem = $returnRequest->order->items()->where('product_id', $returnRequest->product_id)->first();
            $nominal = $orderItem?->subtotal ?? $returnRequest->product?->harga_jual ?? 0;

            CashTransaction::create([
                'tanggal'    => now()->toDateString(),
                'tipe'       => 'keluar',
                'kategori'   => 'Kerugian Retur/Komplain Produk',
                'nominal'    => $nominal,
                'keterangan' => "Retur {$returnRequest->product?->nama} — Order {$returnRequest->order->order_number}",
                'dibuat_oleh'=> $request->user()->id,
            ]);
        }

        return back()->with('success', 'Pengajuan retur telah ' . ($data['status'] === 'disetujui' ? 'disetujui' : 'ditolak') . '.');
    }
}
