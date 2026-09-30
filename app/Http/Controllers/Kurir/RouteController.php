<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\CourierRoute;
use App\Models\Order;
use App\Services\OrderService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class RouteController extends Controller
{
    public function __construct(private OrderService $orders) {}

    public function index(Request $request): Response
    {
        $courier = $request->user()->courierProfile;
        $tanggal = $request->tanggal ?? now()->toDateString();

        $routes = $courier
            ? CourierRoute::with([
                'deliveryBatch:id,nama_kloter,jam_mulai,jam_selesai',
                'stops' => fn ($q) => $q->with('order:id,order_number,total,metode_bayar,status_pembayaran,status_pesanan,catatan_kurir,address_id',
                                                'order.address:id,nama_penerima,telepon_penerima,alamat_lengkap,catatan_patokan'),
            ])
            ->where('courier_id', $courier->id)
            ->whereDate('tanggal', $tanggal)
            ->get()
            : collect();

        return Inertia::render('Kurir/Route/Index', [
            'courier' => $courier,
            'routes'  => $routes,
            'tanggal' => $tanggal,
        ]);
    }

    /** Kurir menandai satu titik antar selesai. Ini juga menyelesaikan Order-nya lewat OrderService. */
    public function complete(Request $request, Order $order): RedirectResponse
    {
        $courier = $request->user()->courierProfile;

        abort_unless($courier && $order->courier_id === $courier->id, 403, 'Pesanan ini bukan bagian dari rute Anda.');

        // Kurir menekan satu tombol "Selesai" tanpa perlu tahu status pesanan sekarang persis di tahap mana
        // (baru/diproses/diantar) — jadi status digeser BERTAHAP mengikuti alur resmi (bukan dilompat)
        // sampai mencapai "selesai".
        $tahapBerikut = ['baru' => 'diproses', 'diproses' => 'diantar', 'diantar' => 'selesai'];

        try {
            while (isset($tahapBerikut[$order->status_pesanan])) {
                $order = $this->orders->updateStatus(
                    $order,
                    $tahapBerikut[$order->status_pesanan],
                    $request->user()->id,
                    'Diselesaikan oleh kurir di lapangan.'
                );
            }
        } catch (ValidationException $e) {
            return back()->with('error', collect($e->errors())->flatten()->first());
        }

        return back()->with('success', "Pesanan {$order->order_number} ditandai selesai.");
    }
}
