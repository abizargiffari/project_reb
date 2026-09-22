<?php

namespace Database\Factories;

use App\Models\Address;
use App\Models\Courier;
use App\Models\DeliveryBatch;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class OrderFactory extends Factory
{
    public function definition(): array
    {
        $subtotal = fake()->numberBetween(15000, 80000);
        $ongkirAsli = 2000;
        $ongkir = fake()->boolean(70) ? 0 : $ongkirAsli; // sering gratis ongkir
        $biayaKantong = 500;
        $total = $subtotal + $ongkir + $biayaKantong;

        return [
            'user_id' => User::where('role', 'customer')->inRandomOrder()->value('id') ?? User::factory(),
            'address_id' => Address::inRandomOrder()->value('id'),
            'delivery_batch_id' => DeliveryBatch::inRandomOrder()->value('id'),
            'courier_id' => Courier::inRandomOrder()->value('id'),
            'subtotal' => $subtotal,
            'ongkir' => $ongkir,
            'ongkir_asli' => $ongkirAsli,
            'biaya_kantong' => $biayaKantong,
            'total' => $total,
            'metode_bayar' => fake()->randomElement(['cod', 'qris', 'va']),
            'status_pembayaran' => fake()->randomElement(['pending', 'lunas', 'lunas', 'lunas']),
            'status_pesanan' => fake()->randomElement(['baru', 'diproses', 'diantar', 'selesai', 'selesai']),
        ];
    }
}
