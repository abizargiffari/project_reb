<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryBatch extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_kloter', 'jam_mulai', 'jam_selesai', 'kuota',
        'terpakai', 'badge_status', 'status_aktif', 'urutan',
    ];

    protected $casts = ['status_aktif' => 'boolean'];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function courierRoutes()
    {
        return $this->hasMany(CourierRoute::class);
    }

    public function getSisaSlotAttribute(): int
    {
        return max($this->kuota - $this->terpakai, 0);
    }
}
