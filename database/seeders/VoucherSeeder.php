<?php

namespace Database\Seeders;

use App\Models\Setting;
use App\Models\Voucher;
use Illuminate\Database\Seeder;

class VoucherSeeder extends Seeder
{
    public function run(): void
    {
        Voucher::updateOrCreate(['kode' => 'WARGA5RB'], [
            'tipe'            => 'nominal',
            'nilai'           => 5000,
            'minimal_belanja' => 25000,
            'kuota'           => 100,
            'berlaku_dari'    => now()->startOfMonth(),
            'berlaku_sampai'  => now()->addMonths(3)->endOfMonth(),
            'status_aktif'    => true,
        ]);

        Voucher::updateOrCreate(['kode' => 'SUBUH10'], [
            'tipe'            => 'persen',
            'nilai'           => 10,
            'minimal_belanja' => 20000,
            'kuota'           => 50,
            'berlaku_dari'    => now()->startOfMonth(),
            'berlaku_sampai'  => now()->addMonths(3)->endOfMonth(),
            'status_aktif'    => true,
        ]);

        // Setting biaya checkout (bisa diubah admin di Pengaturan Lapak pada Modul 7)
        Setting::set('gratis_ongkir_minimal', '30000');
        Setting::set('biaya_kantong', '500');
    }
}
