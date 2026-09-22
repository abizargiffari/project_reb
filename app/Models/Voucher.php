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
        'berlaku_dari' => 'date',
        'berlaku_sampai' => 'date',
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
        $today = now()->toDateString();
        if ($this->berlaku_dari && $today < $this->berlaku_dari) return false;
        if ($this->berlaku_sampai && $today > $this->berlaku_sampai) return false;
        return true;
    }
}
