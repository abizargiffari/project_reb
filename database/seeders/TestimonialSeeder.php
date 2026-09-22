<?php

namespace Database\Seeders;

use App\Models\Testimonial;
use App\Models\User;
use Illuminate\Database\Seeder;

class TestimonialSeeder extends Seeder
{
    public function run(): void
    {
        $testimonials = [
            [
                'nama' => 'Ibu Endar',
                'label' => 'Ibu ketua RT 009',
                'rating' => 5,
                'isi' => 'Alhamdulillah setiap jam 06.45 WIB pesanan paket sop dan tempe daun sudah dicantolkan di pagar oleh mas Yahya. Sayur bayamnya beneran masih segar, praktis sekali buat bekal anak sekolah tanpa harus jalan ke pasar raya.',
                'catatan' => 'Langganan Rutin sejak 2023',
            ],
            [
                'nama' => 'Bu Wahyu Anggraini',
                'label' => 'Perum Delta Pulungan Baru',
                'rating' => 5,
                'isi' => 'Timbangan cabai rawit sama bawang merahnya jujur. Kemarin ada tomat yang kepencet saat dibawa, pas kirim pesan WA, diantar tomat pengganti 2 biji. Warung amanah khas tetangga sendiri.',
                'catatan' => 'Langganan Rutin Masak Harian',
            ],
        ];

        foreach ($testimonials as $t) {
            $user = User::where('name', $t['nama'])->first();
            Testimonial::create(array_merge($t, [
                'user_id' => $user?->id,
                'status_tampil' => true,
            ]));
        }
    }
}
