<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->id();
            $table->string('kode')->unique();
            $table->enum('tipe', ['nominal', 'persen']);
            $table->decimal('nilai', 12, 2);
            $table->decimal('minimal_belanja', 12, 2)->nullable();
            $table->unsignedInteger('kuota')->nullable();
            $table->unsignedInteger('terpakai')->default(0);
            $table->date('berlaku_dari')->nullable();
            $table->date('berlaku_sampai')->nullable();
            $table->boolean('status_aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('vouchers');
    }
};
