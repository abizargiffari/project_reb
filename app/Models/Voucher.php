<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    use HasFactory;

    protected $fillable = [
        'kode', 'tipe', 'nilai', 'minimal_belanja', 'kuota',
        'terpakai', 'berlaku_dari', 'berlaku_sampai', 'status_aktif',
    ];

    protected $casts = [
        'nilai' => 'decimal:2',
        'minimal_belanja' => 'decimal:2',
        'berlaku_dari' => 'date:Y-m-d',
        'berlaku_sampai' => 'date:Y-m-d',
        'status_aktif' => 'boolean',
    ];

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function isValid(): bool
    {
        if (!$this->status_aktif) return false;
        if ($this->kuota !== null && $this->terpakai >= $this->kuota) return false;
        // Bandingkan sesama objek tanggal (jam 00:00 zona aplikasi). Membandingkan STRING '2026-10-04'
        // dengan objek tanggal membuat voucher ditolak di hari pertama berlakunya.
        $today = now()->startOfDay();
        if ($this->berlaku_dari && $today->lt($this->berlaku_dari)) return false;
        if ($this->berlaku_sampai && $today->gt($this->berlaku_sampai)) return false;
        return true;
    }
}
