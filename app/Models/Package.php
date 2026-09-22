<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Package extends Model
{
    use HasFactory;

    protected $fillable = ['nama', 'slug', 'deskripsi', 'harga_diskon', 'harga_coret', 'gambar', 'badge', 'status'];

    protected $casts = [
        'harga_diskon' => 'decimal:2',
        'harga_coret' => 'decimal:2',
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'package_items')->withPivot('qty');
    }

    public function items()
    {
        return $this->hasMany(PackageItem::class);
    }
}
