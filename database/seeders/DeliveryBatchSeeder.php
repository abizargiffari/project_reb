<?php

namespace Database\Seeders;

use App\Models\DeliveryBatch;
use Illuminate\Database\Seeder;

class DeliveryBatchSeeder extends Seeder
{
    public function run(): void
    {
        $batches = [
            [
                'nama_kloter' => 'Subuh Pagi',
                'jam_mulai' => '06:30',
                'jam_selesai' => '08:30',
                'kuota' => 40,
                'terpakai' => 37,
                'badge_status' => 'TERLARIS',
                'urutan' => 1,
            ],
            [
                'nama_kloter' => 'Menjelang Siang',
                'jam_mulai' => '10:30',
                'jam_selesai' => '12:00',
                'kuota' => 30,
                'terpakai' => 10,
                'badge_status' => 'SEGAR SIANG',
                'urutan' => 2,
            ],
            [
                'nama_kloter' => 'Masak Sore',
                'jam_mulai' => '16:00',
                'jam_selesai' => '17:30',
                'kuota' => 25,
                'terpakai' => 5,
                'badge_status' => 'PULANG KERJA',
                'urutan' => 3,
            ],
        ];

        foreach ($batches as $batch) {
            DeliveryBatch::create(array_merge($batch, ['status_aktif' => true]));
        }
    }
}
