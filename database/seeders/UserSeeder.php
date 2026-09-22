<?php

namespace Database\Seeders;

use App\Models\Courier;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Owner / Admin utama
        $admin = User::create([
            'name' => 'Pak Lukman Hakim',
            'email' => 'admin@warungsayurpulungan.test',
            'phone' => '081234567890',
            'role' => 'admin',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        // Akun kurir
        $kurirUser = User::create([
            'name' => 'Yahya',
            'email' => 'yahya@warungsayurpulungan.test',
            'phone' => '081298765432',
            'role' => 'kurir',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
        ]);

        Courier::create([
            'user_id' => $kurirUser->id,
            'nama' => 'Mas Yahya',
            'plat_motor' => 'B 3456 XYZ',
            'telepon' => '081298765432',
            'kapasitas_muat' => 18,
            'status_aktif' => true,
        ]);

        // Beberapa pelanggan contoh (dipakai juga untuk testimoni)
        $pelanggan = [
            ['name' => 'Ibu Endar', 'email' => 'endar@example.test'],
            ['name' => 'Bu Wahyu Anggraini', 'email' => 'wahyu@example.test'],
            ['name' => 'Ibu Sri Murtani', 'email' => 'sri.murtani@example.test'],
        ];

        foreach ($pelanggan as $p) {
            User::create([
                'name' => $p['name'],
                'email' => $p['email'],
                'phone' => '08' . rand(1000000000, 1999999999),
                'role' => 'customer',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
            ]);
        }

        // Tambahan pelanggan acak via factory
        User::factory()->count(15)->create();
    }
}
