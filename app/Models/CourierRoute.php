<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CourierRoute extends Model
{
    protected $fillable = ['courier_id', 'delivery_batch_id', 'tanggal', 'status'];

    protected $casts = ['tanggal' => 'date'];

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }

    public function deliveryBatch()
    {
        return $this->belongsTo(DeliveryBatch::class);
    }

    public function stops()
    {
        return $this->hasMany(RouteStop::class)->orderBy('urutan');
    }
}
