<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('cash_reconciliations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('courier_id')->constrained()->cascadeOnDelete();
            $table->date('tanggal');
            $table->decimal('total_tagihan', 12, 2); // total COD yang seharusnya diterima
            $table->decimal('uang_fisik_diterima', 12, 2);
            $table->decimal('selisih', 12, 2)->default(0); // idealnya 0
            $table->json('rincian_pecahan')->nullable(); // {"100000": 3, "50000": 2, ...}
            $table->enum('status_setor', ['belum', 'sudah'])->default('belum');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('cash_reconciliations');
    }
};
