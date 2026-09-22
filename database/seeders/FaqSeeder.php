<?php

namespace Database\Seeders;

use App\Models\Faq;
use Illuminate\Database\Seeder;

class FaqSeeder extends Seeder
{
    public function run(): void
    {
        $faqs = [
            ['kategori' => 'Pemesanan', 'pertanyaan' => 'Bagaimana cara pesan sayur di Warung Sayur Pulungan?', 'jawaban' => 'Pilih produk di katalog, masukkan ke keranjang, lalu checkout dengan memilih jam kloter antar dan metode pembayaran.'],
            ['kategori' => 'Pemesanan', 'pertanyaan' => 'Sampai jam berapa saya bisa pesan untuk kloter Subuh Pagi?', 'jawaban' => 'Pemesanan kloter Subuh Pagi ditutup otomatis saat kuota penuh atau maksimal jam 06.00 WIB.'],
            ['kategori' => 'Pengiriman', 'pertanyaan' => 'Apakah bisa titip belanja tanpa lewat aplikasi?', 'jawaban' => 'Bisa, hubungi Mas Yahya lewat WhatsApp menggunakan tombol "Titip Belanja via Mas Yahya" di beranda.'],
            ['kategori' => 'Pembayaran', 'pertanyaan' => 'Metode pembayaran apa saja yang tersedia?', 'jawaban' => 'Tersedia COD (bayar tunai di tempat/titip pagar), QRIS otomatis, dan Virtual Account bank otomatis.'],
            ['kategori' => 'Pengiriman', 'pertanyaan' => 'Bagaimana jika sayur yang diterima ternyata busuk atau layu?', 'jawaban' => 'Foto kondisi sayur dan ajukan retur lewat halaman Riwayat Pesanan, tim kami akan mengganti sayur tanpa biaya tambahan.'],
        ];

        foreach ($faqs as $i => $faq) {
            Faq::create(array_merge($faq, ['urutan' => $i + 1]));
        }
    }
}
