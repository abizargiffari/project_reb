<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $today = now()->toDateString();

        return Inertia::render('Admin/Overview', [
            'kpis' => [
                'omzet_hari_ini' => Order::whereDate('created_at', $today)->sum('total'),
                'pesanan_masuk' => Order::whereDate('created_at', $today)->count(),
                'stok_kritis' => Product::whereColumn('stok', '<=', 'stok_minimum')->count(),
                'tagihan_cod' => Order::where('metode_bayar', 'cod')
                    ->where('status_pembayaran', 'pending')
                    ->sum('total'),
            ],
            'pesananTerkini' => Order::with(['user', 'deliveryBatch'])
                ->latest()
                ->limit(10)
                ->get(),
        ]);
    }
}
