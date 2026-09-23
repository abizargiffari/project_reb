<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use App\Models\CourierRoute;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $courier = Auth::user()->courierProfile;

        return Inertia::render('Kurir/Dashboard', [
            'courier' => $courier,
            'rutesHariIni' => $courier
                ? CourierRoute::with('stops.order')
                    ->where('courier_id', $courier->id)
                    ->whereDate('tanggal', now())
                    ->get()
                : [],
        ]);
    }
}
