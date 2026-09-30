<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderStatusRequest;
use App\Models\Courier;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index(Request $request): Response
    {
        $tanggal = $request->tanggal ?? now()->toDateString();

        $orders = Order::query()
            ->with(['user:id,name', 'deliveryBatch:id,nama_kloter', 'courier:id,nama'])
            ->whereDate('created_at', $tanggal)
            ->when($request->delivery_batch_id, fn ($q, $v) => $q->where('delivery_batch_id', $v))
            ->when($request->status_pesanan, fn ($q, $v) => $q->where('status_pesanan', $v))
            ->when($request->search, function ($q, $search) {
                $q->where(function ($q2) use ($search) {
                    $q2->where('order_number', 'like', "%{$search}%")
                    ->orWhereHas('user', fn ($q3) => $q3->where('name', 'like', "%{$search}%"));
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders'   => $orders,
            'batches'  => DeliveryBatch::orderBy('urutan')->get(['id', 'nama_kloter']),
            'couriers' => Courier::where('status_aktif', true)->get(['id', 'nama']),
            'filters'  => array_merge($request->only(['delivery_batch_id', 'status_pesanan', 'search']), ['tanggal' => $tanggal]),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load([
            'user', 'address', 'deliveryBatch', 'courier',
            'items', 'payments' => fn ($q) => $q->latest(),
            'statusLogs' => fn ($q) => $q->latest()->with('changedBy:id,name'),
            'routeStops',
        ]);

        return Inertia::render('Admin/Orders/Show', [
            'order'    => $order,
            'couriers' => Courier::where('status_aktif', true)->get(['id', 'nama']),
        ]);
    }

    public function updateStatus(UpdateOrderStatusRequest $request, Order $order): RedirectResponse
    {
        try {
            $this->orders->updateStatus($order, $request->status_pesanan, $request->user()->id, $request->keterangan);
        } catch (ValidationException $e) {
            return back()->withErrors($e->errors());
        }

        return back()->with('success', "Status pesanan {$order->order_number} diperbarui.");
    }

    public function assignCourier(Request $request, Order $order): RedirectResponse
    {
        $data = $request->validate(['courier_id' => ['required', 'exists:couriers,id']]);

        if (in_array($order->status_pesanan, ['selesai', 'dibatalkan'], true)) {
            return back()->with('error', 'Pesanan yang sudah selesai/dibatalkan tidak bisa ditugaskan ke kurir.');
        }

        $courier = Courier::findOrFail($data['courier_id']);
        $this->orders->assignToCourier($order, $courier);

        return back()->with('success', "Pesanan {$order->order_number} ditugaskan ke {$courier->nama}.");
    }

    public function generateRoute(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'delivery_batch_id' => ['required', 'exists:delivery_batches,id'],
            'tanggal'           => ['required', 'date'],
            'courier_id'        => ['required', 'exists:couriers,id'],
        ]);

        $courier = Courier::findOrFail($data['courier_id']);

        $pesanan = Order::where('delivery_batch_id', $data['delivery_batch_id'])
            ->whereDate('created_at', $data['tanggal'])
            ->whereNull('courier_id')
            ->whereNotIn('status_pesanan', ['dibatalkan'])
            ->orderBy('created_at')
            ->get();

        if ($pesanan->isEmpty()) {
            return back()->with('error', 'Tidak ada pesanan yang perlu ditugaskan untuk kloter & tanggal ini.');
        }

        foreach ($pesanan as $order) {
            $this->orders->assignToCourier($order, $courier);
        }

        return back()->with('success', "{$pesanan->count()} pesanan ditugaskan ke {$courier->nama}.");
    }
}
