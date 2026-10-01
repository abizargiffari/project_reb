<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class OrderHistoryController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->with('deliveryBatch:id,nama_kloter')
            ->withCount('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('Customer/Account/Orders', ['orders' => $orders]);
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        $order->load([
            'items', 'deliveryBatch', 'address', 'courier',
            'statusLogs' => fn ($q) => $q->latest(),
            'returns',
        ]);

        return Inertia::render('Customer/Account/OrderShow', ['order' => $order]);
    }
}
