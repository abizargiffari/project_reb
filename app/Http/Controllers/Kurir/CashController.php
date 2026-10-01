<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\CashReconciliation;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CashController extends Controller
{
    public function index(Request $request): Response
    {
        $courier = $request->user()->courierProfile;
        $tanggal = now()->toDateString();

        $pesananCod = $courier
            ? Order::where('courier_id', $courier->id)
                ->where('metode_bayar', 'cod')
                ->where('status_pesanan', 'selesai')
                ->whereDate('created_at', $tanggal)
                ->get(['id', 'order_number', 'total'])
            : collect();

        return Inertia::render('Kurir/Cash/Index', [
            'courier'      => $courier,
            'tanggal'      => $tanggal,
            'pesananCod'   => $pesananCod,
            'totalTagihan' => (float) $pesananCod->sum('total'),
            'existing'     => $courier
                ? CashReconciliation::where('courier_id', $courier->id)->where('tanggal', $tanggal)->first()
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $courier = $request->user()->courierProfile;
        abort_unless($courier, 403, 'Akun Anda belum terhubung ke profil kurir.');

        $data = $request->validate([
            'uang_fisik_diterima' => ['required', 'numeric', 'min:0'],
            'rincian_pecahan'     => ['nullable', 'array'],
        ]);

        $tanggal = now()->toDateString();

        // Dihitung ULANG di server (bukan dipercaya dari input form) — supaya kurir tidak bisa
        // mengisi total_tagihan sendiri secara manual, hanya uang fisik yang benar-benar dia pegang.
        $totalTagihan = Order::where('courier_id', $courier->id)
            ->where('metode_bayar', 'cod')
            ->where('status_pesanan', 'selesai')
            ->whereDate('created_at', $tanggal)
            ->sum('total');

        CashReconciliation::updateOrCreate(
            ['courier_id' => $courier->id, 'tanggal' => $tanggal],
            [
                'total_tagihan'        => $totalTagihan,
                'uang_fisik_diterima'  => $data['uang_fisik_diterima'],
                'selisih'              => $data['uang_fisik_diterima'] - $totalTagihan,
                'rincian_pecahan'      => $data['rincian_pecahan'] ?? null,
                'status_setor'         => 'sudah',
            ]
        );

        return back()->with('success', 'Setoran kas hari ini berhasil dicatat. Terima kasih, Mas/Mbak!');
    }
}
