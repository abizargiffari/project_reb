<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\User;
use Illuminate\Database\Seeder;

class AddressSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->get();

        foreach ($customers as $customer) {
            Address::create([
                'user_id' => $customer->id,
                'label' => 'Rumah',
                'nama_penerima' => $customer->name,
                'telepon_penerima' => $customer->phone,
                'alamat_lengkap' => 'Jl. Contoh No. ' . rand(1, 50) . ', RT/RW 00' . rand(1, 9) . '/00' . rand(1, 9) . ', Ciganjur, Jagakarsa, Jakarta Selatan',
                'catatan_patokan' => 'Pagar hijau, dekat warung Bu Siti',
                'is_default' => true,
            ]);
        }
    }
}
