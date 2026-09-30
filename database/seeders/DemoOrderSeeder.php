<?php

namespace Database\Seeders;

use App\Models\Address;
use App\Models\DeliveryBatch;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;

class DemoOrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->limit(3)->get();
        $batch = DeliveryBatch::where('nama_kloter', 'Subuh Pagi')->first();
        $produk = Product::where('stok', '>', 5)->limit(2)->get();

        if ($customers->isEmpty() || !$batch || $produk->isEmpty()) {
            $this->command->warn('Jalankan DatabaseSeeder utama dulu (php artisan migrate:fresh --seed) sebelum seeder ini.');
            return;
        }

        foreach ($customers as $i => $customer) {
            $address = Address::firstOrCreate(
                ['user_id' => $customer->id],
                [
                    'label' => 'Rumah', 'nama_penerima' => $customer->name, 'telepon_penerima' => $customer->phone ?? '081200000000',
                    'alamat_lengkap' => "Jl. Contoh Demo No. {$i}, Ciganjur, Jagakarsa", 'is_default' => true,
                ]
            );

            $subtotal = $produk->sum(fn ($p) => $p->harga_jual * 1);

            $order = Order::create([
                'user_id' => $customer->id, 'address_id' => $address->id, 'delivery_batch_id' => $batch->id,
                'subtotal' => $subtotal, 'ongkir' => 0, 'ongkir_asli' => 2000, 'biaya_kantong' => 500,
                'total' => $subtotal + 500, 'metode_bayar' => 'cod', 'status_pembayaran' => 'pending', 'status_pesanan' => 'baru',
            ]);

            foreach ($produk as $p) {
                $order->items()->create([
                    'product_id' => $p->id, 'nama_produk_snapshot' => $p->nama, 'satuan_snapshot' => $p->satuan,
                    'qty' => 1, 'harga_satuan' => $p->harga_jual, 'subtotal' => $p->harga_jual,
                ]);
            }

            $order->statusLogs()->create(['status' => 'baru', 'keterangan' => 'Pesanan demo untuk uji Modul 3.']);
            $order->payments()->create(['channel' => 'cod', 'status' => 'pending']);
        }

        $this->command->info('3 pesanan demo (kloter Subuh Pagi, hari ini) berhasil dibuat.');
    }
}
