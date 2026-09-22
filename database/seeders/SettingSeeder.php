<?php

namespace Database\Seeders;

use App\Models\Setting;
use Illuminate\Database\Seeder;

class SettingSeeder extends Seeder
{
    public function run(): void
    {
        $settings = [
            'store_name' => 'Warung Sayur Pulungan',
            'store_tagline' => 'Segar Setiap Pagi • Area Ciganjur & Jagakarsa',
            'store_address' => 'Jl. H. Montong No. 8D, RT 01/RW 02, Ciganjur, Kec. Jagakarsa, Kota Jakarta Selatan, DKI Jakarta 12630',
            'store_phone' => '0812-3456-7890',
            'store_open_hours' => '05:00 - 18:00 WIB',
            'payment_bank_name' => 'BCA',
            'payment_bank_number' => '1234567890',
            'payment_bank_holder' => 'Lukman Hakim',
            'payment_qris_status' => 'connected',
            'ongkir_flat' => '2000',
            'area_layanan' => 'Ciganjur, Jagakarsa, Cipedak, Lenteng Agung',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }
    }
}
