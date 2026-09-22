<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CashReconciliation extends Model
{
    protected $fillable = [
        'courier_id', 'tanggal', 'total_tagihan', 'uang_fisik_diterima',
        'selisih', 'rincian_pecahan', 'status_setor',
    ];

    protected $casts = [
        'tanggal' => 'date',
        'total_tagihan' => 'decimal:2',
        'uang_fisik_diterima' => 'decimal:2',
        'selisih' => 'decimal:2',
        'rincian_pecahan' => 'array',
    ];

    public function courier()
    {
        return $this->belongsTo(Courier::class);
    }
}
