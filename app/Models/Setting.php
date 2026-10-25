<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;

class Setting extends Model
{
    protected $fillable = ['key', 'value'];

    public static function get(string $key, $default = null)
    {
        return Cache::rememberForever("setting:{$key}", function () use ($key, $default) {
            return static::where('key', $key)->value('value') ?? $default;
        });
    }

    public static function set(string $key, $value): void
    {
        static::updateOrCreate(['key' => $key], ['value' => $value]);
        Cache::forget("setting:{$key}");
        Cache::forget('toko_publik'); // bundel di bawah ikut diperbarui begitu admin menyimpan pengaturan
    }

    /**
     * Data toko yang boleh tampil publik (footer, halaman Kontak, Tentang Kami).
     * Disimpan di SATU cache key supaya footer tidak memicu belasan query tiap halaman dibuka.
     */
    public static function publik(): array
    {
        return Cache::rememberForever('toko_publik', fn () => [
            'nama'            => static::get('store_name', 'Warung Sayur Pulungan'),
            'tagline'         => static::get('store_tagline', ''),
            'alamat'          => static::get('store_address', ''),
            'telepon'         => static::get('store_phone', ''),
            'email'           => static::get('store_email', ''),
            'jam_operasional' => static::get('store_open_hours', ''),
            'area_layanan'    => static::get('area_layanan', ''),
            'whatsapp'        => static::get('social_whatsapp', ''),
            'instagram'       => static::get('social_instagram', ''),
            'facebook'        => static::get('social_facebook', ''),
        ]);
    }
}
