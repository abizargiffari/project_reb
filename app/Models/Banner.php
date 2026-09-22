<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'judul', 'gambar', 'link', 'posisi',
        'tanggal_mulai', 'tanggal_selesai', 'status_aktif', 'urutan',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'status_aktif' => 'boolean',
    ];

    public function scopeAktif($query)
    {
        return $query->where('status_aktif', true)
            ->where(fn ($q) => $q->whereNull('tanggal_mulai')->orWhereDate('tanggal_mulai', '<=', now()))
            ->where(fn ($q) => $q->whereNull('tanggal_selesai')->orWhereDate('tanggal_selesai', '>=', now()));
    }
}
