<?php

namespace App\Console\Commands;

use App\Models\Order;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Console\Command;

class ExpireStaleOrders extends Command
{
    protected $signature = 'orders:expire-stale {--jam=24 : Batas jam sejak pesanan dibuat sebelum dianggap kedaluwarsa}';

    protected $description = 'Batalkan otomatis pesanan QRIS/VA yang belum dibayar melewati batas waktu (jaring pengaman kalau webhook Midtrans tidak sampai)';

    public function handle(OrderService $orders, MidtransService $midtrans): int
    {
        $batasJam = (int) $this->option('jam');

        $staleOrders = Order::query()
            ->where('metode_bayar', '!=', 'cod')
            ->where('status_pembayaran', 'pending')
            ->where('status_pesanan', '!=', 'dibatalkan')
            ->where('created_at', '<=', now()->subHours($batasJam))
            ->get();

        if ($staleOrders->isEmpty()) {
            $this->info('Tidak ada pesanan yang kedaluwarsa.');
            return self::SUCCESS;
        }

        foreach ($staleOrders as $order) {
            // Cek status asli ke Midtrans dulu — barangkali sebenarnya SUDAH lunas
            // tapi webhook-nya yang gagal sampai ke server kita (jangan sampai salah batalkan).
            try {
                $status = \Midtrans\Transaction::status($order->order_number);
                $current = is_array($status) ? ($status['transaction_status'] ?? null) : ($status->transaction_status ?? null);

                if (in_array($current, ['settlement', 'capture'], true)) {
                    $order->update(['status_pembayaran' => 'lunas']);
                    $this->warn("Order {$order->order_number}: ternyata SUDAH lunas di Midtrans, status diperbaiki (bukan dibatalkan).");
                    continue;
                }
            } catch (\Throwable $e) {
                report($e); // order belum pernah ada transaksi Midtrans sama sekali — lanjut dibatalkan seperti biasa
            }

            $orders->cancel($order, "Otomatis dibatalkan: belum dibayar setelah {$batasJam} jam.");
            $midtrans->cancelIfPending($order->order_number);

            $this->line("Order {$order->order_number} dibatalkan otomatis.");
        }

        $this->info(count($staleOrders) . ' pesanan diproses.');
        return self::SUCCESS;
    }
}
