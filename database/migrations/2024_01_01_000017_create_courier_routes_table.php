<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('courier_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('courier_id')->constrained()->cascadeOnDelete();
            $table->foreignId('delivery_batch_id')->constrained()->restrictOnDelete();
            $table->date('tanggal');
            $table->enum('status', ['menunggu', 'berjalan', 'selesai'])->default('menunggu');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('courier_routes');
    }
};
