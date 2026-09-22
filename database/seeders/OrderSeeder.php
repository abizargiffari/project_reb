<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        // Butuh Address, DeliveryBatch, Courier, Product sudah ada (jalankan seeder ini paling akhir)
        Order::factory()->count(25)->create()->each(function (Order $order) {
            $items = Product::inRandomOrder()->limit(rand(1, 4))->get();
            $subtotal = 0;

            foreach ($items as $product) {
                $qty = rand(1, 3);
                $subtotalItem = $qty * $product->harga_jual;
                $subtotal += $subtotalItem;

                $order->items()->create([
                    'product_id' => $product->id,
                    'nama_produk_snapshot' => $product->nama,
                    'satuan_snapshot' => $product->satuan,
                    'qty' => $qty,
                    'harga_satuan' => $product->harga_jual,
                    'subtotal' => $subtotalItem,
                ]);
            }

            // Selaraskan subtotal & total order dengan item yang benar-benar dibuat
            $total = $subtotal + $order->ongkir + $order->biaya_kantong;
            $order->update(['subtotal' => $subtotal, 'total' => $total]);

            $order->statusLogs()->create([
                'status' => $order->status_pesanan,
                'keterangan' => 'Status awal saat seeding data demo.',
            ]);

            if ($order->status_pembayaran === 'lunas') {
                $order->payments()->create([
                    'channel' => $order->metode_bayar,
                    'status' => 'settlement',
                    'paid_at' => now(),
                ]);
            }
        });
    }
}
