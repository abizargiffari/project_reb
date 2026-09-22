<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number', 'user_id', 'address_id', 'delivery_batch_id', 'courier_id', 'voucher_id',
        'subtotal', 'ongkir', 'ongkir_asli', 'biaya_kantong', 'potongan_voucher', 'total',
        'metode_bayar', 'status_pembayaran', 'status_pesanan',
        'catatan_kurir', 'cod_nominal_disiapkan',
    ];

    protected $casts = [
        'subtotal' => 'decimal:2',
        'ongkir' => 'decimal:2',
        'ongkir_asli' => 'decimal:2',
        'biaya_kantong' => 'decimal:2',
        'potongan_voucher' => 'decimal:2',
        'total' => 'decimal:2',
        'cod_nominal_disiapkan' => 'decimal:2',
    ];

    protected static function booted()
    {
        static::creating(function ($order) {
            if (!$order->order_number) {
                $order->order_number = 'INV-' . now()->format('Ymd') . '-' . strtoupper(uniqid());
            }
        });
    }

    // ── Relasi ──────────────────────────────────────────────
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function address()
    {
        return $this->belongsTo(Address::class);
    }

    public function deliveryBatch()
    {
        return $this->belongsTo(DeliveryBatch::class);
    }

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }

    public function voucher()
    {
        return $this->belongsTo(Voucher::class);
    }

    public function items()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function statusLogs()
    {
        return $this->hasMany(OrderStatusLog::class);
    }

    public function payments()
    {
        return $this->hasMany(Payment::class);
    }

    public function latestPayment()
    {
        return $this->hasOne(Payment::class)->latestOfMany();
    }

    public function routeStops()
    {
        return $this->hasMany(RouteStop::class);
    }

    public function returns()
    {
        return $this->hasMany(ReturnRequest::class);
    }
}
