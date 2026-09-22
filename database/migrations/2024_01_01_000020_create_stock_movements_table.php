<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('stock_movements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained()->cascadeOnDelete();
            $table->enum('tipe', ['masuk', 'keluar', 'susut', 'retur']);
            $table->integer('qty'); // positif untuk masuk/retur, negatif untuk keluar/susut (atau simpan absolut + tipe)
            $table->string('sumber')->nullable(); // "Kulakan Pasar Induk", "Auto-deduct Order #INV001"
            $table->text('keterangan')->nullable();
            $table->foreignId('created_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('stock_movements');
    }
};
