<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Testimonial extends Model
{
    protected $fillable = ['user_id', 'nama', 'label', 'rating', 'isi', 'avatar', 'catatan', 'status_tampil'];

    protected $casts = ['status_tampil' => 'boolean'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
