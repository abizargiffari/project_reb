<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number')->unique();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('address_id')->constrained()->restrictOnDelete();
            $table->foreignId('delivery_batch_id')->constrained()->restrictOnDelete();
            $table->foreignId('courier_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('voucher_id')->nullable()->constrained()->nullOnDelete();

            $table->decimal('subtotal', 12, 2);
            $table->decimal('ongkir', 12, 2)->default(0);
            $table->decimal('ongkir_asli', 12, 2)->nullable(); // sebelum digratiskan, untuk tampilan dicoret
            $table->decimal('biaya_kantong', 12, 2)->default(0);
            $table->decimal('potongan_voucher', 12, 2)->default(0);
            $table->decimal('total', 12, 2);

            $table->enum('metode_bayar', ['cod', 'qris', 'va', 'transfer']);
            $table->enum('status_pembayaran', ['pending', 'menunggu_verifikasi', 'lunas', 'gagal'])->default('pending');
            $table->enum('status_pesanan', ['baru', 'diproses', 'diantar', 'selesai', 'dibatalkan'])->default('baru');

            $table->text('catatan_kurir')->nullable(); // instruksi titip pagar, dst
            $table->decimal('cod_nominal_disiapkan', 12, 2)->nullable(); // uang yang disiapkan pelanggan untuk kembalian COD

            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
