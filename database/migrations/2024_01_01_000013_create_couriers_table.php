<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('couriers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete(); // akun login kurir, jika ada
            $table->string('nama'); // "Mas Yahya"
            $table->string('plat_motor')->nullable();
            $table->string('telepon')->nullable();
            $table->unsignedInteger('kapasitas_muat')->nullable(); // jumlah keranjang/pintu
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('couriers');
    }
};
