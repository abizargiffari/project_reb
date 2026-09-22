<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Urutan pemanggilan WAJIB seperti ini karena mengikuti dependency foreign key:
     * User & Courier dulu -> Category -> Product -> Package (butuh Product)
     * -> DeliveryBatch -> Address (butuh User) -> Testimonial (butuh User)
     * -> Faq, Banner, Setting (independen) -> Order (butuh semua di atas).
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            CategorySeeder::class,
            ProductSeeder::class,
            PackageSeeder::class,
            DeliveryBatchSeeder::class,
            AddressSeeder::class,
            TestimonialSeeder::class,
            FaqSeeder::class,
            BannerSeeder::class,
            SettingSeeder::class,
            OrderSeeder::class,
        ]);
    }
}
