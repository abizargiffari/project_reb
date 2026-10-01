<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Cetak Batch ({{ $orders->count() }} struk)</title>
    <style>
        @page { size: 80mm auto; margin: 0; }
        * { box-sizing: border-box; }
        body { font-family: 'Courier New', Courier, monospace; font-size: 12px; color: #000; margin: 0; }
        .struk {
            width: 80mm; margin: 0 auto; padding: 10px 8px;
            page-break-after: always;
        }
        .struk:last-child { page-break-after: auto; }
        .center { text-align: center; }
        .right { text-align: right; }
        .bold { font-weight: 700; }
        .sep { border-top: 1px dashed #000; margin: 6px 0; }
        table { width: 100%; border-collapse: collapse; }
        td { padding: 1px 0; vertical-align: top; }
        .no-wrap { white-space: nowrap; }
        .toolbar {
            width: 80mm; margin: 10px auto; display: flex; gap: 8px;
        }
        .toolbar button {
            flex: 1; padding: 8px; font-size: 13px; cursor: pointer;
            border-radius: 6px; border: 1px solid #1E4D3B; background: #1E4D3B; color: #fff;
        }
        @media print { .toolbar { display: none; } }
    </style>
</head>
<body>
    <div class="toolbar">
        <button onclick="window.print()">🖨 Cetak Semua ({{ $orders->count() }} Struk)</button>
    </div>

    @foreach($orders as $order)
        <div class="struk">
            <div class="center bold">{{ $toko['nama'] }}</div>
            @if($toko['alamat'])<div class="center">{{ $toko['alamat'] }}</div>@endif
            @if($toko['telepon'])<div class="center">{{ $toko['telepon'] }}</div>@endif

            <div class="sep"></div>

            <table>
                <tr><td>No. Order</td><td class="right no-wrap">{{ $order->order_number }}</td></tr>
                <tr><td>Tanggal</td><td class="right no-wrap">{{ $order->created_at->format('d/m/Y H:i') }}</td></tr>
                <tr><td>Kloter</td><td class="right no-wrap">{{ $order->deliveryBatch?->nama_kloter }}</td></tr>
                <tr><td>Kurir</td><td class="right no-wrap">{{ $order->courier?->nama ?? '-' }}</td></tr>
            </table>

            <div class="sep"></div>

            <div class="bold">{{ $order->address?->nama_penerima }}</div>
            <div>{{ $order->address?->telepon_penerima }}</div>
            <div>{{ $order->address?->alamat_lengkap }}</div>
            @if($order->catatan_kurir)<div>Catatan: {{ $order->catatan_kurir }}</div>@endif

            <div class="sep"></div>

            <table>
                @foreach($order->items as $item)
                    <tr><td colspan="2">{{ $item->nama_produk_snapshot }}</td></tr>
                    <tr>
                        <td>{{ $item->qty }} x {{ number_format($item->harga_satuan, 0, ',', '.') }}</td>
                        <td class="right no-wrap">{{ number_format($item->subtotal, 0, ',', '.') }}</td>
                    </tr>
                @endforeach
            </table>

            <div class="sep"></div>

            <table>
                <tr><td>Subtotal</td><td class="right no-wrap">Rp {{ number_format($order->subtotal, 0, ',', '.') }}</td></tr>
                <tr>
                    <td>Ongkir</td>
                    <td class="right no-wrap">{{ (float) $order->ongkir === 0.0 ? 'GRATIS' : 'Rp ' . number_format($order->ongkir, 0, ',', '.') }}</td>
                </tr>
                <tr><td>Biaya Kantong</td><td class="right no-wrap">Rp {{ number_format($order->biaya_kantong, 0, ',', '.') }}</td></tr>
                @if((float) $order->potongan_voucher > 0)
                    <tr><td>Potongan Voucher</td><td class="right no-wrap">- Rp {{ number_format($order->potongan_voucher, 0, ',', '.') }}</td></tr>
                @endif
            </table>

            <div class="sep"></div>
            <table><tr class="bold"><td>TOTAL</td><td class="right no-wrap">Rp {{ number_format($order->total, 0, ',', '.') }}</td></tr></table>
            <div class="sep"></div>

            <table>
                <tr><td>Metode Bayar</td><td class="right no-wrap">{{ strtoupper($order->metode_bayar) }}</td></tr>
                <tr><td>Status Bayar</td><td class="right no-wrap">{{ $order->status_pembayaran === 'lunas' ? 'LUNAS' : 'BELUM LUNAS' }}</td></tr>
                @if($order->metode_bayar === 'cod' && $order->cod_nominal_disiapkan)
                    <tr><td>Uang Disiapkan</td><td class="right no-wrap">Rp {{ number_format($order->cod_nominal_disiapkan, 0, ',', '.') }}</td></tr>
                    <tr><td>Kembalian</td><td class="right no-wrap">Rp {{ number_format($order->cod_nominal_disiapkan - $order->total, 0, ',', '.') }}</td></tr>
                @endif
            </table>

            <div class="sep"></div>
            <div class="center">Terima kasih telah berbelanja!</div>
            <div class="center">Timbangan Jujur & Amanah</div>
        </div>
    @endforeach
</body>
</html>
