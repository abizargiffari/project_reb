<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey    = config('midtrans.server_key');
        Config::$isProduction = config('midtrans.is_production');
        Config::$isSanitized  = config('midtrans.is_sanitized');
        Config::$is3ds        = config('midtrans.is_3ds');
    }

    /**
     * Membuat Snap token untuk sebuah order.
     * gross_amount dihitung dari jumlah item_details supaya SELALU sama
     * (Midtrans menolak transaksi kalau totalnya tidak cocok).
     */
    public function createSnapToken(Order $order): string
    {
        $order->loadMissing('user', 'address', 'items');

        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'id'       => 'P' . ($item->product_id ?? $item->id),
                'price'    => (int) round($item->harga_satuan),
                'quantity' => (int) $item->qty,
                'name'     => mb_substr($item->nama_produk_snapshot, 0, 50),
            ];
        }
        if ($order->ongkir > 0) {
            $items[] = ['id' => 'ONGKIR', 'price' => (int) round($order->ongkir), 'quantity' => 1, 'name' => 'Ongkos Kirim'];
        }
        if ($order->biaya_kantong > 0) {
            $items[] = ['id' => 'KANTONG', 'price' => (int) round($order->biaya_kantong), 'quantity' => 1, 'name' => 'Biaya Penanganan & Kantong Bio'];
        }
        if ($order->potongan_voucher > 0) {
            $items[] = ['id' => 'VOUCHER', 'price' => -1 * (int) round($order->potongan_voucher), 'quantity' => 1, 'name' => 'Potongan Voucher'];
        }

        $gross = collect($items)->sum(fn ($i) => $i['price'] * $i['quantity']);

        $params = [
            'transaction_details' => [
                'order_id'     => $order->order_number,
                'gross_amount' => $gross,
            ],
            'item_details'     => $items,
            'customer_details' => [
                'first_name' => $order->address->nama_penerima ?? $order->user->name,
                'email'      => $order->user->email,
                'phone'      => $order->address->telepon_penerima ?? $order->user->phone,
            ],
            // QRIS memerlukan GoPay/ShopeePay QRIS aktif di akun merchant Midtrans.
            // Untuk VA: Midtrans mensyaratkan permata_va ikut disebut bila other_va dipakai.
            'enabled_payments' => $order->metode_bayar === 'qris'
                ? ['other_qris', 'gopay', 'shopeepay']
                : ['bca_va', 'bni_va', 'bri_va', 'permata_va', 'other_va'],
        ];

        return Snap::getSnapToken($params);
    }

    /** Validasi signature webhook: sha512(order_id + status_code + gross_amount + server_key) */
    public function isValidSignature(array $payload): bool
    {
        $expected = hash('sha512',
            ($payload['order_id'] ?? '') .
            ($payload['status_code'] ?? '') .
            ($payload['gross_amount'] ?? '') .
            config('midtrans.server_key')
        );

        return hash_equals($expected, (string) ($payload['signature_key'] ?? ''));
    }

    /** Terjemahkan status Midtrans ke status internal tabel payments. */
    public function mapStatus(array $payload): string
    {
        $status = $payload['transaction_status'] ?? 'pending';

        return match ($status) {
            'capture'    => ($payload['fraud_status'] ?? 'accept') === 'accept' ? 'settlement' : 'pending',
            'settlement' => 'settlement',
            'deny'       => 'deny',
            'cancel'     => 'cancel',
            'expire'     => 'expire',
            default      => 'pending',
        };
    }
}
