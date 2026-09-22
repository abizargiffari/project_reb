<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('testimonials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nama');
            $table->string('label')->nullable(); // "Ibu ketua RT 009"
            $table->unsignedTinyInteger('rating')->default(5);
            $table->text('isi');
            $table->string('avatar')->nullable();
            $table->string('catatan')->nullable(); // "Langganan Rutin sejak 2023"
            $table->boolean('status_tampil')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('testimonials');
    }
};
