<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PackageSeeder extends Seeder
{
    public function run(): void
    {
        $packages = [
            [
                'nama' => 'Paket Sayur Asem Segar Lengkap',
                'deskripsi' => 'Kacang panjang, labu siam, jagung manis, melinjo, daun melinjo + bumbu racik asam khas Jawa Timuran.',
                'harga_diskon' => 11500,
                'harga_coret' => 14500,
                'badge' => 'Paling Favorit',
            ],
            [
                'nama' => 'Paket Sayur Lodeh Tahu Tempe',
                'deskripsi' => 'Terong ungu, labu siam, tahu putih, tempe potong, cabai hijau besar + kelapa parut peras kental.',
                'harga_diskon' => 13000,
                'harga_coret' => 16000,
                'badge' => null,
            ],
            [
                'nama' => 'Paket Sambal Terasi Segar Komplit',
                'deskripsi' => 'Cabai rawit merah (100g), cabai merah besar, bawang merah, tomat buah manis + terasi Juwana wangi matang.',
                'harga_diskon' => 9500,
                'harga_coret' => 12000,
                'badge' => null,
            ],
        ];

        foreach ($packages as $pkg) {
            $package = Package::create([
                'nama' => $pkg['nama'],
                'slug' => Str::slug($pkg['nama']),
                'deskripsi' => $pkg['deskripsi'],
                'harga_diskon' => $pkg['harga_diskon'],
                'harga_coret' => $pkg['harga_coret'],
                'badge' => $pkg['badge'],
                'status' => 'aktif',
            ]);

            // Isi paket dengan 2-4 produk acak yang sudah ada
            $produkAcak = Product::inRandomOrder()->limit(rand(2, 4))->get();
            foreach ($produkAcak as $produk) {
                $package->items()->create([
                    'product_id' => $produk->id,
                    'qty' => rand(1, 2),
                ]);
            }
        }
    }
}
