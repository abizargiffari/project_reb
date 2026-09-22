<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

// Nama kelas "ReturnRequest" dipakai karena "Return" adalah reserved keyword di PHP.
// Nama tabel tetap "returns" sesuai migration.
class ReturnRequest extends Model
{
    protected $table = 'returns';

    protected $fillable = ['order_id', 'order_item_id', 'product_id', 'alasan', 'status', 'foto_bukti'];

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function orderItem()
    {
        return $this->belongsTo(OrderItem::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
