<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Courier extends Model
{
    use HasFactory;

    protected $fillable = ['user_id', 'nama', 'plat_motor', 'telepon', 'kapasitas_muat', 'status_aktif'];

    protected $casts = ['status_aktif' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function routes()
    {
        return $this->hasMany(CourierRoute::class);
    }

    public function cashReconciliations()
    {
        return $this->hasMany(CashReconciliation::class);
    }
}
