<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Models\Setting;
use Illuminate\Contracts\View\View;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PrintController extends Controller
{
    public function index(Request $request): Response
    {
        $tanggal = $request->tanggal ?? now()->toDateString();

        $orders = Order::query()
            ->with(['user:id,name', 'deliveryBatch:id,nama_kloter'])
            ->whereDate('created_at', $tanggal)
            ->whereNotIn('status_pesanan', ['dibatalkan'])
            ->when($request->delivery_batch_id, fn ($q, $v) => $q->where('delivery_batch_id', $v))
            ->orderBy('delivery_batch_id')
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Admin/Print/Index', [
            'orders'  => $orders,
            'batches' => DeliveryBatch::orderBy('urutan')->get(['id', 'nama_kloter']),
            'filters' => ['tanggal' => $tanggal, 'delivery_batch_id' => $request->delivery_batch_id ?? ''],
        ]);
    }

    /**
     * Struk satu pesanan. Sengaja mengembalikan Blade view biasa (bukan Inertia) karena
     * halaman ini dibuka di tab/window baru khusus untuk dicetak — tidak butuh sidebar admin
     * atau SPA React sama sekali, supaya hasil Ctrl+P bersih tanpa elemen aplikasi ikut tercetak.
     */
    public function struk(Request $request, Order $order): View
    {
        $order->load('items', 'address', 'deliveryBatch', 'user', 'courier');

        return view('admin.print.struk', [
            'order'     => $order,
            'toko'      => $this->infoToko(),
            'autoPrint' => $request->boolean('auto'),
            'embed'     => $request->boolean('embed'),
        ]);
    }

    /** Cetak banyak pesanan sekaligus, satu struk per halaman cetak (page-break). */
    public function strukBatch(Request $request): View
    {
        $ids = array_filter(explode(',', (string) $request->query('ids')));

        abort_if(empty($ids), 404, 'Tidak ada pesanan yang dipilih.');

        $orders = Order::with('items', 'address', 'deliveryBatch', 'user', 'courier')
            ->whereIn('id', $ids)
            // Urutan cetak mengikuti urutan dipilih pengguna, bukan urutan id di database.
            ->orderByRaw('FIELD(id, ' . implode(',', array_map('intval', $ids)) . ')')
            ->get();

        return view('admin.print.struk-batch', [
            'orders' => $orders,
            'toko'   => $this->infoToko(),
        ]);
    }

    private function infoToko(): array
    {
        return [
            'nama'    => Setting::get('store_name', 'Warung Sayur Pulungan'),
            'alamat'  => Setting::get('store_address', ''),
            'telepon' => Setting::get('store_phone', ''),
        ];
    }
}
