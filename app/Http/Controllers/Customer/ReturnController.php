<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\ReturnRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class ReturnController extends Controller
{
    public function store(Request $request, Order $order): RedirectResponse
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        if ($order->status_pesanan !== 'selesai') {
            return back()->with('error', 'Retur hanya bisa diajukan untuk pesanan yang sudah selesai diantar.');
        }

        $data = $request->validate([
            'product_id'  => ['required', 'exists:products,id'],
            'alasan'      => ['required', 'string', 'max:500'],
            'foto_bukti'  => ['nullable', 'image', 'max:2048'],
        ]);

        $itemAda = $order->items()->where('product_id', $data['product_id'])->exists();
        abort_unless($itemAda, 422, 'Produk ini bukan bagian dari pesanan tersebut.');

        $sudahDiajukan = ReturnRequest::where('order_id', $order->id)
            ->where('product_id', $data['product_id'])
            ->whereIn('status', ['diajukan', 'disetujui'])
            ->exists();

        if ($sudahDiajukan) {
            return back()->with('error', 'Retur untuk produk ini sudah pernah diajukan pada pesanan ini.');
        }

        $orderItem = $order->items()->where('product_id', $data['product_id'])->first();

        ReturnRequest::create([
            'order_id'      => $order->id,
            'order_item_id' => $orderItem?->id,
            'product_id'    => $data['product_id'],
            'alasan'        => $data['alasan'],
            'status'        => 'diajukan',
            'foto_bukti'    => $request->hasFile('foto_bukti') ? $request->file('foto_bukti')->store('retur', 'public') : null,
        ]);

        return back()->with('success', 'Pengajuan retur berhasil dikirim. Tim kami akan segera meninjau.');
    }
}
