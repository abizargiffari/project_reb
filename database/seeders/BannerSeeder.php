<?php

namespace Database\Seeders;

use App\Models\Banner;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        Banner::create([
            'judul' => 'Sayur Panen Subuh Langsung ke Pagar Rumah',
            'gambar' => 'banners/hero-sayur-subuh.jpg',
            'link' => '/katalog',
            'posisi' => 'hero',
            'status_aktif' => true,
            'urutan' => 1,
        ]);
    }
}
