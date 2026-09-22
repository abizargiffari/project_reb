<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained()->cascadeOnDelete();
            $table->string('nama');
            $table->string('slug')->unique();
            $table->text('deskripsi')->nullable();
            $table->enum('satuan', ['ikat', 'kg', 'gram', 'bungkus', 'paket', 'papan'])->default('ikat');
            $table->decimal('harga_jual', 12, 2);
            $table->decimal('harga_modal', 12, 2)->default(0); // harga beli subuh, untuk hitung margin
            $table->decimal('harga_coret', 12, 2)->nullable(); // harga sebelum diskon
            $table->integer('stok')->default(0);
            $table->integer('stok_minimum')->default(5); // ambang batas "stok kritis"
            $table->string('sku')->unique();
            $table->string('gambar')->nullable();
            $table->string('badge')->nullable(); // Dipetik Subuh, Diskon Pagi, dst
            $table->string('catatan_stok')->nullable(); // "Stok Segar Melimpah", "Sisa 4 bungkus"
            $table->enum('status', ['aktif', 'nonaktif'])->default('aktif');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
