<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    public function definition(): array
    {
        $nama = fake()->words(3, true);
        $hargaModal = fake()->numberBetween(2000, 15000);

        return [
            'category_id' => Category::inRandomOrder()->value('id') ?? Category::factory(),
            'nama' => ucwords($nama),
            'slug' => Str::slug($nama) . '-' . fake()->unique()->numberBetween(1, 99999),
            'deskripsi' => fake()->sentence(10),
            'satuan' => fake()->randomElement(['ikat', 'kg', 'gram', 'bungkus', 'paket']),
            'harga_jual' => $hargaModal + fake()->numberBetween(500, 5000),
            'harga_modal' => $hargaModal,
            'harga_coret' => fake()->boolean(30) ? $hargaModal + fake()->numberBetween(3000, 6000) : null,
            'stok' => fake()->numberBetween(0, 40),
            'stok_minimum' => 5,
            'sku' => strtoupper(Str::random(8)),
            'badge' => fake()->randomElement([null, null, 'Dipetik Subuh', 'Diskon Pagi', 'Pilihan Pagi']),
            'catatan_stok' => fake()->randomElement(['Stok Segar Melimpah', 'Sisa 4 bungkus', 'Petik 04.30 WIB']),
            'status' => 'aktif',
        ];
    }
}
