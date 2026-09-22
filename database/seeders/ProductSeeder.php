<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $daun = Category::where('nama', 'Sayur Daun Segar')->first()->id;
        $buahUmbi = Category::where('nama', 'Sayur Buah & Umbi')->first()->id;
        $bumbu = Category::where('nama', 'Bumbu Dapur & Rempah')->first()->id;
        $sembako = Category::where('nama', 'Sembako & Tahu Tempe')->first()->id;

        $products = [
            ['category_id' => $daun, 'nama' => 'Bayam Hijau Cabut Segar', 'satuan' => 'ikat', 'harga_jual' => 3500, 'harga_modal' => 2200, 'badge' => 'Dipetik Subuh', 'catatan_stok' => 'Stok Segar Melimpah', 'stok' => 30],
            ['category_id' => $daun, 'nama' => 'Kangkung Akar Segar Petani', 'satuan' => 'ikat', 'harga_jual' => 2500, 'harga_coret' => 3000, 'harga_modal' => 1600, 'badge' => 'Diskon Pagi', 'catatan_stok' => 'Petik 04.30 WIB', 'stok' => 25],
            ['category_id' => $buahUmbi, 'nama' => 'Tomat Merah Sayur Segar', 'satuan' => 'kg', 'harga_jual' => 14000, 'harga_modal' => 9500, 'badge' => 'Pilihan Pagi', 'catatan_stok' => 'Bisa ecer 500g (Rp7.000)', 'stok' => 20],
            ['category_id' => $bumbu, 'nama' => 'Cabai Rawit Merah Segar (Sret)', 'satuan' => 'gram', 'harga_jual' => 8000, 'harga_modal' => 5500, 'badge' => 'Super Pedas', 'catatan_stok' => 'Sisa 4 bungkus', 'stok' => 4, 'stok_minimum' => 5],
            ['category_id' => $bumbu, 'nama' => 'Bawang Merah Brebes Pilihan', 'satuan' => 'gram', 'harga_jual' => 18000, 'harga_modal' => 13000, 'catatan_stok' => 'Kering & Tidak Busuk', 'stok' => 18],
            ['category_id' => $buahUmbi, 'nama' => 'Wortel Berastagi Manis', 'satuan' => 'kg', 'harga_jual' => 12000, 'harga_modal' => 8000, 'catatan_stok' => 'Renyah & Cocok Untuk Sop', 'stok' => 22],
            ['category_id' => $buahUmbi, 'nama' => 'Jagung Manis Segar (Isi 2 Tongkol)', 'satuan' => 'bungkus', 'harga_jual' => 7000, 'harga_modal' => 4500, 'catatan_stok' => 'Manis Alami Petik Kemarin', 'stok' => 15],
            ['category_id' => $sembako, 'nama' => 'Tempe Daun Pisang Murni', 'satuan' => 'papan', 'harga_jual' => 4000, 'harga_modal' => 2500, 'badge' => 'Pengrajin Ciganjur', 'catatan_stok' => 'Padat, wangi daun alami', 'stok' => 20],
            ['category_id' => $sembako, 'nama' => 'Tahu Sutra Putih Lembut (Isi 5)', 'satuan' => 'bungkus', 'harga_jual' => 6000, 'harga_modal' => 3800, 'catatan_stok' => 'Dibuat subuh, bebas pengawet', 'stok' => 16],
            ['category_id' => $buahUmbi, 'nama' => 'Buncis Baby Segar Renyah', 'satuan' => 'gram', 'harga_jual' => 6500, 'harga_modal' => 4200, 'catatan_stok' => 'Muda, tanpa serat keras', 'stok' => 14],
            ['category_id' => $bumbu, 'nama' => 'Jeruk Nipis Peras Wangi', 'satuan' => 'gram', 'harga_jual' => 5000, 'harga_modal' => 3000, 'badge' => 'Habis Subuh Tadi', 'catatan_stok' => 'Stok kloter 1 habis (Restok Kloter 2)', 'stok' => 0, 'status' => 'aktif'],
        ];

        foreach ($products as $p) {
            Product::create(array_merge([
                'harga_coret' => null,
                'stok_minimum' => 5,
                'status' => 'aktif',
                'sku' => strtoupper(Str::random(8)),
            ], $p, [
                'slug' => Str::slug($p['nama']),
                'deskripsi' => $p['nama'] . ' langsung dari petani lokal Ciganjur & Jagakarsa.',
            ]));
        }

        // Tambahan produk acak biar grid katalog lebih ramai saat pengembangan
        Product::factory()->count(20)->create();
    }
}
