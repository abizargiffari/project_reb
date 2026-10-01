import AdminLayout from '@/Layouts/AdminLayout';
import SimpleBarChart from '@/Components/UI/SimpleBarChart';
import { rupiah } from '@/Utils/format';
import { Head, router } from '@inertiajs/react';

function Kpi({ label, value }) {
    return (
        <div className="bg-white rounded-xl2 shadow-sm p-4">
            <p className="text-xs text-text-secondary">{label}</p>
            <p className="text-xl font-bold text-primary mt-1">{value}</p>
        </div>
    );
}

export default function Index({ periode, trenOmzet, produkTerlaris, performaKloter, performaKurir, ringkasan }) {
    function ubahPeriode(p) {
        router.get(route('admin.analytics.index'), { periode: p }, { preserveState: true, replace: true });
    }

    const trenUntukChart = trenOmzet.map((t) => ({
        ...t,
        label: new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }),
    }));

    return (
        <AdminLayout>
            <Head title="Analitik" />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                    <h1 className="text-2xl font-bold text-primary">Analitik & Statistik</h1>
                    <p className="text-sm text-text-secondary">Tren penjualan dan performa {periode} hari terakhir.</p>
                </div>
                <div className="flex gap-2">
                    {[7, 30].map((p) => (
                        <button
                            key={p}
                            onClick={() => ubahPeriode(p)}
                            className={`px-4 py-2 rounded-full text-sm font-medium ${periode === p ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                        >
                            {p} Hari
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <Kpi label="Total Omzet" value={rupiah(ringkasan.total_omzet)} />
                <Kpi label="Total Pesanan Lunas" value={ringkasan.total_pesanan} />
                <Kpi label="Rata-rata Nilai Pesanan" value={rupiah(ringkasan.rata_rata_pesanan)} />
                <Kpi label="Pelanggan Aktif" value={ringkasan.pelanggan_aktif} />
                <Kpi label="Pelanggan Baru" value={ringkasan.pelanggan_baru} />
            </div>

            <div className="bg-white rounded-xl2 shadow-sm p-5 mb-6">
                <p className="font-bold text-primary mb-4">Tren Omzet Harian</p>
                <SimpleBarChart data={trenUntukChart} labelKey="label" valueKey="omzet" />
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                    <p className="font-bold text-primary px-5 pt-4 pb-2">Produk Terlaris</p>
                    <table className="w-full text-sm">
                        <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                            <tr><th className="px-4 py-2">#</th><th className="px-4 py-2">Produk</th><th className="px-4 py-2 text-right">Terjual</th><th className="px-4 py-2 text-right">Omzet</th></tr>
                        </thead>
                        <tbody>
                            {produkTerlaris.length === 0 && (
                                <tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Belum ada penjualan di periode ini.</td></tr>
                            )}
                            {produkTerlaris.map((p, i) => (
                                <tr key={p.product_id ?? i} className="border-t border-gray-100">
                                    <td className="px-4 py-2 text-text-secondary">{i + 1}</td>
                                    <td className="px-4 py-2">{p.nama_produk_snapshot}</td>
                                    <td className="px-4 py-2 text-right font-semibold">{p.total_qty}</td>
                                    <td className="px-4 py-2 text-right font-semibold text-primary">{rupiah(p.total_omzet)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                    <p className="font-bold text-primary px-5 pt-4 pb-2">Performa per Kloter</p>
                    <table className="w-full text-sm">
                        <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                            <tr><th className="px-4 py-2">Kloter</th><th className="px-4 py-2 text-right">Pesanan</th><th className="px-4 py-2 text-right">Omzet</th></tr>
                        </thead>
                        <tbody>
                            {performaKloter.map((k, i) => (
                                <tr key={i} className="border-t border-gray-100">
                                    <td className="px-4 py-2">{k.nama_kloter}</td>
                                    <td className="px-4 py-2 text-right font-semibold">{k.jumlah_pesanan}</td>
                                    <td className="px-4 py-2 text-right font-semibold text-primary">{rupiah(k.omzet)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <p className="font-bold text-primary px-5 pt-4 pb-2">Performa Kurir</p>
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-2">Kurir</th>
                            <th className="px-4 py-2 text-right">Pesanan Diantar</th>
                            <th className="px-4 py-2 text-right">Omzet Diantar</th>
                            <th className="px-4 py-2 text-right">Rata-rata Selisih Kas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {performaKurir.length === 0 && (
                            <tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Belum ada data kurir di periode ini.</td></tr>
                        )}
                        {performaKurir.map((k, i) => (
                            <tr key={i} className="border-t border-gray-100">
                                <td className="px-4 py-2 font-semibold">{k.nama}</td>
                                <td className="px-4 py-2 text-right">{k.jumlah_pesanan}</td>
                                <td className="px-4 py-2 text-right font-semibold text-primary">{rupiah(k.omzet_diantar)}</td>
                                <td className="px-4 py-2 text-right">
                                    {k.rata_selisih_kas === null ? (
                                        <span className="text-text-secondary">belum setor</span>
                                    ) : (
                                        <span className={Number(k.rata_selisih_kas) === 0 ? 'text-success font-semibold' : 'text-danger font-semibold'}>
                                            {rupiah(k.rata_selisih_kas)}
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
