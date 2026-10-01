<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class CustomerController extends Controller
{
    public function index(Request $request): Response
    {
        $customers = User::query()
            ->where('role', 'customer')
            ->withCount(['orders as total_pesanan' => fn ($q) => $q->where('status_pesanan', '!=', 'dibatalkan')])
            ->withSum(['orders as total_belanja' => fn ($q) => $q->where('status_pembayaran', 'lunas')], 'total')
            ->withMax('orders as pesanan_terakhir', 'created_at')
            ->when($request->search, fn ($q, $s) => $q->where(fn ($q2) => $q2->where('name', 'like', "%{$s}%")->orWhere('email', 'like', "%{$s}%")))
            ->orderByDesc('pesanan_terakhir')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Customers/Index', [
            'customers' => $customers,
            'filters'   => $request->only('search'),
        ]);
    }

    public function show(User $user): Response
    {
        abort_unless($user->role === 'customer', 404);

        $orders = Order::where('user_id', $user->id)
            ->with('deliveryBatch:id,nama_kloter')
            ->latest()
            ->paginate(10);

        $ringkasan = [
            'total_pesanan'  => Order::where('user_id', $user->id)->where('status_pesanan', '!=', 'dibatalkan')->count(),
            'total_belanja'  => (float) Order::where('user_id', $user->id)->where('status_pembayaran', 'lunas')->sum('total'),
            'retur_diajukan' => DB::table('returns')->whereIn('order_id', function ($q) use ($user) {
                $q->select('id')->from('orders')->where('user_id', $user->id);
            })->count(),
        ];

        return Inertia::render('Admin/Customers/Show', [
            'customer'  => $user,
            'orders'    => $orders,
            'ringkasan' => $ringkasan,
        ]);
    }
}
