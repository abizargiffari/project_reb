import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { jam, rupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function Success({ order, snapToken, snapError, clientKey, isProduction }) {
    const [snapReady, setSnapReady] = useState(false);
    const [pesan, setPesan] = useState(null);
    const sudahBuka = useRef(false);

    const online = order.metode_bayar !== 'cod';
    const dibatalkan = order.status_pesanan === 'dibatalkan';
    const lunas = order.status_pembayaran === 'lunas';
    const menunggu = online && !lunas && !dibatalkan && !!snapToken;

    // Muat skrip Snap Midtrans hanya bila memang perlu bayar online.
    useEffect(() => {
        if (!snapToken) return;

        const src = isProduction ? 'https://app.midtrans.com/snap/snap.js' : 'https://app.sandbox.midtrans.com/snap/snap.js';
        const onLoad = () => setSnapReady(true);
        let script = document.querySelector(`script[src="${src}"]`);

        if (script) {
            if (window.snap) setSnapReady(true);
            else script.addEventListener('load', onLoad);
        } else {
            script = document.createElement('script');
            script.src = src;
            script.async = true;
            script.setAttribute('data-client-key', clientKey);
            script.addEventListener('load', onLoad);
            document.body.appendChild(script);
        }

        return () => script && script.removeEventListener('load', onLoad);
    }, [snapToken]);

    function cekStatus() {
        router.reload({ only: ['order', 'snapToken', 'snapError'] });
    }

    function bayar() {
        if (!window.snap || !snapToken) return;
        setPesan(null);
        window.snap.pay(snapToken, {
            onSuccess: cekStatus,
            onPending: cekStatus,
            onError: () => setPesan('Pembayaran gagal diproses. Silakan coba lagi.'),
            onClose: () => {},
        });
    }

    // Buka popup otomatis satu kali begitu skrip siap.
    useEffect(() => {
        if (snapReady && menunggu && !sudahBuka.current) {
            sudahBuka.current = true;
            bayar();
        }
    }, [snapReady, menunggu]);

    // Webhook Midtrans tiba beberapa detik setelah bayar: cek ulang berkala (maks. ±5 menit).
    useEffect(() => {
        if (!menunggu) return;
        let n = 0;
        const id = setInterval(() => {
            n += 1;
            if (n > 50) return clearInterval(id);
            cekStatus();
        }, 6000);
        return () => clearInterval(id);
    }, [menunggu]);

    let banner;
    if (dibatalkan) {
        banner = { warna: 'bg-danger-light text-danger', judul: 'Pesanan dibatalkan', teks: 'Pembayaran tidak selesai atau kedaluwarsa. Stok sudah dikembalikan, kamu bisa berbelanja lagi.' };
    } else if (!online) {
        banner = { warna: 'bg-success-light text-success', judul: 'Pesanan diterima! 🎉', teks: `Siapkan uang tunai ${rupiah(order.total)} saat Mas Yahya tiba.` };
    } else if (lunas) {
        banner = { warna: 'bg-success-light text-success', judul: 'Pembayaran diterima ✓', teks: 'Terima kasih! Pesananmu akan segera kami siapkan.' };
    } else {
        banner = { warna: 'bg-orange-50 text-accent-orange', judul: 'Menunggu pembayaran', teks: 'Selesaikan pembayaran agar pesananmu diproses.' };
    }

    return (
        <CustomerLayout>
            <Head title={`Pesanan ${order.order_number}`} />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className={`rounded-xl2 px-5 py-4 ${banner.warna}`}>
                    <p className="font-bold">{banner.judul}</p>
                    <p className="mt-0.5 text-sm">{banner.teks}</p>
                </div>

                {snapError && (
                    <div className="mt-3 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger">
                        {snapError}
                        <button onClick={cekStatus} className="ml-2 underline">Coba lagi</button>
                    </div>
                )}
                {pesan && <div className="mt-3 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger">{pesan}</div>}

                {menunggu && (
                    <div className="mt-4 flex flex-wrap gap-3">
                        <button onClick={bayar} disabled={!snapReady} className="rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50">
                            {snapReady ? `Bayar Sekarang (${rupiah(order.total)})` : 'Menyiapkan pembayaran...'}
                        </button>
                        <button onClick={cekStatus} className="rounded-xl border border-primary px-5 py-3 text-sm font-semibold text-primary">
                            Cek Status Pembayaran
                        </button>
                    </div>
                )}

                <div className="mt-6 rounded-xl2 bg-white p-5 shadow-sm">
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <p className="text-xs text-text-secondary">Nomor Pesanan</p>
                            <p className="font-bold text-primary">{order.order_number}</p>
                        </div>
                        <Badge color={dibatalkan ? 'danger' : lunas ? 'success' : 'orange'}>
                            {dibatalkan ? 'DIBATALKAN' : lunas ? 'LUNAS' : online ? 'MENUNGGU BAYAR' : 'BAYAR DI TEMPAT'}
                        </Badge>
                    </div>

                    <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-text-secondary">Jam Antar</dt>
                            <dd className="font-semibold">{order.kloter} • {jam(order.jam_mulai)}–{jam(order.jam_selesai)} WIB</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-text-secondary">Penerima</dt>
                            <dd className="font-semibold">{order.penerima}</dd>
                            <dd className="text-text-secondary">{order.alamat}</dd>
                        </div>
                    </dl>

                    <ul className="mt-5 divide-y divide-gray-100 border-t border-gray-100 text-sm">
                        {order.items.map((i) => (
                            <li key={i.id} className="flex justify-between py-2">
                                <span>{i.qty} × {i.nama}</span>
                                <span className="font-semibold">{rupiah(i.subtotal)}</span>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-2 space-y-1 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span>{rupiah(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-text-secondary">Ongkir</span><span>{Number(order.ongkir) === 0 ? 'GRATIS' : rupiah(order.ongkir)}</span></div>
                        <div className="flex justify-between"><span className="text-text-secondary">Biaya Penanganan & Kantong Bio</span><span>{rupiah(order.biaya_kantong)}</span></div>
                        {Number(order.potongan_voucher) > 0 && (
                            <div className="flex justify-between text-success"><span>Potongan Voucher</span><span>− {rupiah(order.potongan_voucher)}</span></div>
                        )}
                        <div className="flex justify-between pt-2 text-base font-bold text-primary"><span>Total</span><span>{rupiah(order.total)}</span></div>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    <Link href={route('account.orders')} className="rounded-xl border border-primary px-5 py-2.5 text-sm font-semibold text-primary">Riwayat Pesanan</Link>
                    <Link href={route('catalog.index')} className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">Lanjut Belanja</Link>
                </div>
            </div>
        </CustomerLayout>
    );
}
