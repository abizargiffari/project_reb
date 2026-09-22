<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    protected $fillable = [
        'order_id', 'channel', 'midtrans_order_id', 'midtrans_transaction_id',
        'status', 'raw_response', 'paid_at',
    ];

    protected $casts = [
        'raw_response' => 'array',
        'paid_at' => 'datetime',
    ];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
}
