import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, useForm, usePage } from '@inertiajs/react';

const PECAHAN = [100000, 50000, 20000, 10000, 5000, 2000, 1000];

export default function Index({ courier, tanggal, pesananCod, totalTagihan, existing }) {
    const { flash } = usePage().props;

    const { data, setData, post, processing } = useForm({
        uang_fisik_diterima: existing?.uang_fisik_diterima ?? '',
        rincian_pecahan: existing?.rincian_pecahan ?? Object.fromEntries(PECAHAN.map((p) => [p, ''])),
    });

    const totalDariPecahan = PECAHAN.reduce((sum, p) => sum + (Number(data.rincian_pecahan[p]) || 0) * p, 0);

    function pakaiTotalPecahan() {
        setData('uang_fisik_diterima', totalDariPecahan);
    }

    function submit(e) {
        e.preventDefault();
        post(route('kurir.cash.store'), { preserveScroll: true });
    }

    const selisih = (Number(data.uang_fisik_diterima) || 0) - totalTagihan;

    if (!courier) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-5 text-center">
                <p className="text-text-secondary">Akun Anda belum terhubung ke profil kurir. Hubungi admin.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-10">
            <Head title="Setoran Kas Harian" />

            <header className="bg-primary text-white px-5 py-4 sticky top-0 z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-white/70">Setoran Kas COD</p>
                        <p className="font-bold text-lg">{courier.nama} — {tanggal}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('kurir.route.index')} className="text-xs font-semibold text-white/90 underline">Rute</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-xs font-semibold text-white/90 underline">
                            Keluar
                        </Link>
                    </div>
                </div>
            </header>

            {flash?.success && <div className="m-4 bg-success-light text-success px-4 py-3 rounded-xl text-sm font-medium">{flash.success}</div>}

            <main className="p-4 space-y-4">
                <div className="bg-white rounded-xl2 shadow-sm p-4">
                    <p className="font-bold text-primary mb-2">Pesanan COD Selesai Hari Ini ({pesananCod.length})</p>
                    {pesananCod.length === 0 ? (
                        <p className="text-sm text-text-secondary">Belum ada pesanan COD yang selesai diantar hari ini.</p>
                    ) : (
                        <ul className="divide-y divide-gray-50 text-sm">
                            {pesananCod.map((o) => (
                                <li key={o.id} className="flex justify-between py-1.5">
                                    <span>{o.order_number}</span>
                                    <span className="font-semibold">{rupiah(o.total)}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                    <div className="flex justify-between pt-2 mt-2 border-t border-gray-100 font-bold text-primary">
                        <span>Total Tagihan</span>
                        <span>{rupiah(totalTagihan)}</span>
                    </div>
                </div>

                {existing?.status_setor === 'sudah' && (
                    <div className="bg-success-light text-success rounded-xl2 p-4 text-sm font-medium">
                        ✓ Setoran hari ini sudah tercatat. Mengisi ulang form di bawah akan memperbarui catatan sebelumnya.
                    </div>
                )}

                <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-4">
                    <p className="font-bold text-primary mb-3">Hitung Uang Fisik (opsional, per pecahan)</p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                        {PECAHAN.map((p) => (
                            <div key={p} className="flex items-center gap-2">
                                <span className="text-xs text-text-secondary w-20 flex-shrink-0">Rp{p.toLocaleString('id-ID')}</span>
                                <input
                                    type="number" min="0" placeholder="0"
                                    value={data.rincian_pecahan[p]}
                                    onChange={(e) => setData('rincian_pecahan', { ...data.rincian_pecahan, [p]: e.target.value })}
                                    className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm"
                                />
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={pakaiTotalPecahan} className="w-full border border-primary text-primary rounded-lg py-2 text-sm font-semibold mb-4">
                        Gunakan Total: {rupiah(totalDariPecahan)}
                    </button>

                    <label className="block text-xs font-semibold mb-1.5">Total Uang Fisik Diterima (Rp)</label>
                    <input
                        type="number" min="0" required
                        value={data.uang_fisik_diterima}
                        onChange={(e) => setData('uang_fisik_diterima', e.target.value)}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base font-bold text-center"
                    />

                    <div className="flex items-center justify-between mt-3 px-1">
                        <span className="text-sm text-text-secondary">Selisih dari tagihan</span>
                        {selisih === 0 ? <Badge color="success">Pas, Rp0</Badge> : <Badge color="danger">{selisih > 0 ? '+' : ''}{rupiah(selisih)}</Badge>}
                    </div>

                    <button type="submit" disabled={processing} className="mt-4 w-full bg-primary text-white rounded-xl py-3 text-sm font-bold disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Catat Setoran Hari Ini'}
                    </button>
                </form>
            </main>
        </div>
    );
}
