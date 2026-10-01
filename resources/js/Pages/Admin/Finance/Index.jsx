import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';

function Kpi({ label, value, tone = 'primary' }) {
    const warna = tone === 'danger' ? 'text-danger' : tone === 'success' ? 'text-success' : 'text-primary';
    return (
        <div className="bg-white rounded-xl2 shadow-sm p-5">
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${warna}`}>{rupiah(value)}</p>
        </div>
    );
}

export default function Index({ summary, transactions, reconciliations, filters }) {
    const periode = useForm({ dari: filters.dari, sampai: filters.sampai });
    const form = useForm({
        tanggal: new Date().toISOString().slice(0, 10),
        tipe: 'keluar',
        kategori: '',
        nominal: '',
        keterangan: '',
    });

    function applyPeriode(data) {
        const merged = { ...periode.data, ...data };
        periode.setData(merged);
        router.get(route('admin.finance.index'), merged, { preserveState: true, replace: true });
    }

    function submitTransaksi(e) {
        e.preventDefault();
        form.post(route('admin.finance.transaction.store'), {
            preserveScroll: true,
            onSuccess: () => form.reset('kategori', 'nominal', 'keterangan'),
        });
    }

    function hapusTransaksi(t) {
        if (confirm(`Hapus transaksi "${t.kategori}" sebesar ${rupiah(t.nominal)}?`)) {
            router.delete(route('admin.finance.transaction.destroy', t.id), { preserveScroll: true });
        }
    }

    const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

    return (
        <AdminLayout>
            <Head title="Keuangan & Kas" />

            <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                    <h1 className="text-2xl font-bold text-primary">Keuangan & Kas</h1>
                    <p className="text-sm text-text-secondary">Laba/rugi dihitung dari pesanan lunas dan transaksi kas manual.</p>
                </div>
                <div className="flex items-end gap-2">
                    <div>
                        <label className="block text-xs font-semibold mb-1">Dari</label>
                        <input type="date" value={periode.data.dari} onChange={(e) => applyPeriode({ dari: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold mb-1">Sampai</label>
                        <input type="date" value={periode.data.sampai} onChange={(e) => applyPeriode({ sampai: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                    </div>
                    <a
                        href={`${route('admin.finance.export')}?dari=${periode.data.dari}&sampai=${periode.data.sampai}`}
                        className="border border-primary text-primary rounded-lg px-4 py-2 text-sm font-semibold"
                    >
                        ⬇ Export CSV
                    </a>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <Kpi label="Omzet (Lunas)" value={summary.omzet} />
                <Kpi label="Modal/HPP Terjual" value={summary.modal} />
                <Kpi label="Laba Kotor" value={summary.laba_kotor} tone={summary.laba_kotor >= 0 ? 'success' : 'danger'} />
                <Kpi label="Biaya Operasional" value={summary.biaya_keluar} tone="danger" />
                <Kpi label="Laba Bersih" value={summary.laba_bersih} tone={summary.laba_bersih >= 0 ? 'success' : 'danger'} />
            </div>
            <p className="text-m text-text-secondary -mt-4 mb-6">
                {summary.jumlah_pesanan_lunas} pesanan lunas dalam periode ini. Laba Bersih = Omzet − Modal − Biaya Operasional + Pemasukan Kas Lain.
            </p>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Transaksi kas manual */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="bg-white rounded-xl2 shadow-sm p-5">
                        <p className="font-bold text-primary mb-3">Catat Transaksi Kas Manual</p>
                        <form onSubmit={submitTransaksi} className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="block text-xs font-semibold mb-1">Tanggal</label>
                                <input type="date" className={inputClass} value={form.data.tanggal} onChange={(e) => form.setData('tanggal', e.target.value)} />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1">Tipe</label>
                                <select className={inputClass} value={form.data.tipe} onChange={(e) => form.setData('tipe', e.target.value)}>
                                    <option value="keluar">Kas Keluar (biaya)</option>
                                    <option value="masuk">Kas Masuk (lainnya)</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-semibold mb-1">Kategori</label>
                                <input className={inputClass} placeholder="Kulakan Tambahan, Beli Kantong Bio, dll" value={form.data.kategori} onChange={(e) => form.setData('kategori', e.target.value)} />
                                {form.errors.kategori && <p className="text-xs text-danger mt-1">{form.errors.kategori}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1">Nominal (Rp)</label>
                                <input type="number" className={inputClass} value={form.data.nominal} onChange={(e) => form.setData('nominal', e.target.value)} />
                                {form.errors.nominal && <p className="text-xs text-danger mt-1">{form.errors.nominal}</p>}
                            </div>
                            <div>
                                <label className="block text-xs font-semibold mb-1">Keterangan (opsional)</label>
                                <input className={inputClass} value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} />
                            </div>
                            <button type="submit" disabled={form.processing} className="col-span-2 bg-primary text-white rounded-lg py-2.5 text-sm font-semibold disabled:opacity-50">
                                Simpan Transaksi
                            </button>
                        </form>
                        <p className="text-m text-text-secondary mt-2">
                            Jangan catat penjualan online di sini — omzet sudah otomatis dihitung dari pesanan lunas.
                        </p>
                    </div>

                    <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                        <p className="font-bold text-primary px-5 pt-4 pb-2">Riwayat Transaksi Kas</p>
                        <table className="w-full text-sm">
                            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                                <tr><th className="px-4 py-2">Tanggal</th><th className="px-4 py-2">Kategori</th><th className="px-4 py-2 text-right">Nominal</th><th className="px-4 py-2 text-right">Aksi</th></tr>
                            </thead>
                            <tbody>
                                {transactions.length === 0 && (
                                    <tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Belum ada transaksi di periode ini.</td></tr>
                                )}
                                {transactions.map((t) => (
                                    <tr key={t.id} className="border-t border-gray-100">
                                        <td className="px-4 py-2">{t.tanggal}</td>
                                        <td className="px-4 py-2">{t.kategori}<p className="text-xs text-text-secondary">{t.keterangan}</p></td>
                                        <td className={`px-4 py-2 text-right font-semibold ${t.tipe === 'keluar' ? 'text-danger' : 'text-success'}`}>
                                            {t.tipe === 'keluar' ? '−' : '+'} {rupiah(t.nominal)}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <button onClick={() => hapusTransaksi(t)} className="text-danger text-xs font-semibold hover:underline">Hapus</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Rekonsiliasi kas kurir */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                        <p className="font-bold text-primary px-5 pt-4 pb-2">Rekonsiliasi Kas Kurir (COD)</p>
                        <table className="w-full text-sm">
                            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                                <tr><th className="px-4 py-2">Tanggal</th><th className="px-4 py-2">Kurir</th><th className="px-4 py-2 text-right">Selisih</th></tr>
                            </thead>
                            <tbody>
                                {reconciliations.length === 0 && (
                                    <tr><td colSpan={3} className="px-4 py-6 text-center text-text-secondary">Belum ada setoran di periode ini.</td></tr>
                                )}
                                {reconciliations.map((r) => (
                                    <tr key={r.id} className="border-t border-gray-100">
                                        <td className="px-4 py-2">{r.tanggal}</td>
                                        <td className="px-4 py-2">{r.courier?.nama}</td>
                                        <td className="px-4 py-2 text-right">
                                            {Number(r.selisih) === 0 ? (
                                                <Badge color="success">Pas</Badge>
                                            ) : (
                                                <Badge color="danger">{Number(r.selisih) > 0 ? '+' : ''}{rupiah(r.selisih)}</Badge>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
