<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Tabel "kloter" pengantaran: Subuh, Menjelang Siang, Masak Sore, dst
        Schema::create('delivery_batches', function (Blueprint $table) {
            $table->id();
            $table->string('nama_kloter'); // "Subuh Pagi", "Menjelang Siang"
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->unsignedInteger('kuota')->default(0);
            $table->unsignedInteger('terpakai')->default(0);
            $table->string('badge_status')->nullable(); // TERLARIS, SEGAR SIANG, dst
            $table->boolean('status_aktif')->default(true);
            $table->unsignedInteger('urutan')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_batches');
    }
};
