<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['nama' => 'Sayur Daun Segar', 'icon' => 'leaf', 'urutan' => 1],
            ['nama' => 'Sayur Buah & Umbi', 'icon' => 'carrot', 'urutan' => 2],
            ['nama' => 'Bumbu Dapur & Rempah', 'icon' => 'pepper', 'urutan' => 3],
            ['nama' => 'Sembako & Tahu Tempe', 'icon' => 'package', 'urutan' => 4],
            ['nama' => 'Paket Masak Hemat', 'icon' => 'box', 'urutan' => 5],
        ];

        foreach ($categories as $cat) {
            Category::create([
                'nama' => $cat['nama'],
                'slug' => \Illuminate\Support\Str::slug($cat['nama']),
                'icon' => $cat['icon'],
                'urutan' => $cat['urutan'],
                'status_aktif' => true,
            ]);
        }
    }
}
