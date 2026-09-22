<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    protected $fillable = ['nama', 'slug', 'icon', 'urutan', 'status_aktif'];

    protected $casts = ['status_aktif' => 'boolean'];

    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
