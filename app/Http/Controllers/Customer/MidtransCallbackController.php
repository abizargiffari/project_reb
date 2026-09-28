<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Services\MidtransService;
use App\Services\OrderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MidtransCallbackController extends Controller
{
    public function __construct(
        private MidtransService $midtrans,
        private OrderService $orders,
    ) {}

    public function handle(Request $request): JsonResponse
    {
        $payload = $request->all();

        // Tolak notifikasi palsu: hanya Midtrans yang tahu server key untuk membuat signature ini.
        if (!$this->midtrans->isValidSignature($payload)) {
            return response()->json(['message' => 'Signature tidak valid'], 403);
        }

        $payment = Payment::where('midtrans_order_id', $payload['order_id'] ?? '')->first();

        // "Test notification" dari dashboard Midtrans memakai order_id acak: balas 200 agar tidak di-retry.
        if (!$payment) {
            return response()->json(['message' => 'Order tidak dikenali, diabaikan']);
        }

        $this->orders->applyPaymentStatus($payment, $this->midtrans->mapStatus($payload), $payload);

        return response()->json(['message' => 'OK']);
    }
}
