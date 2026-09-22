<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'nama', 'slug', 'deskripsi', 'satuan',
        'harga_jual', 'harga_modal', 'harga_coret', 'stok', 'stok_minimum',
        'sku', 'gambar', 'badge', 'catatan_stok', 'status',
    ];

    protected $casts = [
        'harga_jual' => 'decimal:2',
        'harga_modal' => 'decimal:2',
        'harga_coret' => 'decimal:2',
    ];

    // ── Relasi ──────────────────────────────────────────────
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }

    public function stockMovements()
    {
        return $this->hasMany(StockMovement::class);
    }

    public function wishlistedBy()
    {
        return $this->hasMany(Wishlist::class);
    }

    public function packages()
    {
        return $this->belongsToMany(Package::class, 'package_items')->withPivot('qty');
    }

    // ── Accessor ────────────────────────────────────────────
    public function getIsLowStockAttribute(): bool
    {
        return $this->stok <= $this->stok_minimum;
    }

    public function getMarginPersenAttribute(): float
    {
        if (!$this->harga_modal) return 0;
        return round((($this->harga_jual - $this->harga_modal) / $this->harga_modal) * 100, 1);
    }
}
