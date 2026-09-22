<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RouteStop extends Model
{
    protected $fillable = ['courier_route_id', 'order_id', 'urutan', 'estimasi_waktu', 'status'];

    public function courierRoute()
    {
        return $this->belongsTo(CourierRoute::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
