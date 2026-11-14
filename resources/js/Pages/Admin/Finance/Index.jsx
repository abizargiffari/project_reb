import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';

const BULAN = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
function tanggalIndo(t) {
    const [y, m, d] = String(t ?? '').slice(0, 10).split('-');
    return y && m && d ? `${Number(d)} ${BULAN[Number(m) - 1]} ${y}` : '-';
}

const hariIni = () => new Date().toLocaleDateString('en-CA');

function Kpi({ label, value, tone = 'primary', className = '' }) {
    const warna = tone === 'danger' ? 'text-danger' : tone === 'success' ? 'text-success' : 'text-primary';
    return (
        <div className={`rounded-xl2 bg-white p-4 shadow-sm ${className}`}>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`mt-1 break-words text-lg font-bold xl:text-xl ${warna}`}>{rupiah(value)}</p>
        </div>
    );
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none';

export default function Index({ summary, transactions, reconciliations, filters }) {
    const periode = useForm({ dari: filters.dari, sampai: filters.sampai });
    const form = useForm({ tanggal: hariIni(), tipe: 'keluar', kategori: '', nominal: '', keterangan: '' });

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

    return (
        <AdminLayout>
            <Head title="Keuangan & Kas" />

            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Keuangan & Kas</h1>
                <p className="text-sm text-text-secondary">Laba/rugi dihitung dari pesanan lunas dan transaksi kas manual.</p>

                <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-end">
                    <div>
                        <label className="mb-1 block text-xs font-semibold">Dari</label>
                        <input type="date" value={periode.data.dari} onChange={(e) => applyPeriode({ dari: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                        <label className="mb-1 block text-xs font-semibold">Sampai</label>
                        <input type="date" value={periode.data.sampai} onChange={(e) => applyPeriode({ sampai: e.target.value })} className={inputClass} />
                    </div>
                    <a
                        href={`${route('admin.finance.export')}?dari=${periode.data.dari}&sampai=${periode.data.sampai}`}
                        className="col-span-2 rounded-lg border border-primary px-4 py-2 text-center text-sm font-semibold text-primary sm:col-span-1"
                    >
                        ⬇ Export CSV
                    </a>
                </div>
            </div>

            {}
            <div className="mb-2 grid grid-cols-2 gap-3 lg:grid-cols-5">
                <Kpi label="Omzet (Lunas)" value={summary.omzet} />
                <Kpi label="Modal/HPP Terjual" value={summary.modal} />
                <Kpi label="Laba Kotor" value={summary.laba_kotor} tone={summary.laba_kotor >= 0 ? 'success' : 'danger'} />
                <Kpi label="Biaya Operasional" value={summary.biaya_keluar} tone="danger" />
                <Kpi label="Laba Bersih" value={summary.laba_bersih} tone={summary.laba_bersih >= 0 ? 'success' : 'danger'} className="col-span-2 lg:col-span-1" />
            </div>
            <p className="mb-6 text-xs text-text-secondary">
                {summary.jumlah_pesanan_lunas} pesanan lunas dalam periode ini. Laba Bersih = Omzet − Modal − Biaya Operasional + Pemasukan Kas Lain.
            </p>

            <div className="grid gap-6 lg:grid-cols-5">
                <div className="space-y-4 lg:col-span-3">
                    <div className="rounded-xl2 bg-white p-5 shadow-sm">
                        <p className="mb-3 font-bold text-primary">Catat Transaksi Kas Manual</p>
                        <form onSubmit={submitTransaksi} className="grid gap-3 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-xs font-semibold">Tanggal</label>
                                <input type="date" className={inputClass} value={form.data.tanggal} onChange={(e) => form.setData('tanggal', e.target.value)} />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold">Tipe</label>
                                <select className={inputClass} value={form.data.tipe} onChange={(e) => form.setData('tipe', e.target.value)}>
                                    <option value="keluar">Kas Keluar (biaya)</option>
                                    <option value="masuk">Kas Masuk (lainnya)</option>
                                </select>
                            </div>
                            <div className="sm:col-span-2">
                                <label className="mb-1 block text-xs font-semibold">Kategori</label>
                                <input className={inputClass} placeholder="Kulakan Tambahan, Beli Kantong Bio, dll" value={form.data.kategori} onChange={(e) => form.setData('kategori', e.target.value)} />
                                {form.errors.kategori && <p className="mt-1 text-xs text-danger">{form.errors.kategori}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold">Nominal (Rp)</label>
                                <input type="number" inputMode="numeric" className={inputClass} value={form.data.nominal} onChange={(e) => form.setData('nominal', e.target.value)} />
                                {form.errors.nominal && <p className="mt-1 text-xs text-danger">{form.errors.nominal}</p>}
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-semibold">Keterangan (opsional)</label>
                                <input className={inputClass} value={form.data.keterangan} onChange={(e) => form.setData('keterangan', e.target.value)} />
                            </div>
                            <button type="submit" disabled={form.processing} className="rounded-lg bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2">
                                Simpan Transaksi
                            </button>
                        </form>
                        <p className="mt-2 text-xs text-text-secondary">
                            ⚠️ Jangan catat penjualan online di sini — omzet sudah otomatis dihitung dari pesanan lunas.
                        </p>
                    </div>

                    <div className="overflow-hidden rounded-xl2 bg-white shadow-sm">
                        <p className="px-5 pb-2 pt-4 font-bold text-primary">Riwayat Transaksi Kas</p>
                        <ul className="divide-y divide-gray-100">
                            {transactions.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-secondary">Belum ada transaksi di periode ini.</li>}
                            {transactions.map((t) => (
                                <li key={t.id} className="flex items-start justify-between gap-3 px-5 py-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">{t.kategori}</p>
                                        {t.keterangan && <p className="break-words text-xs text-text-secondary">{t.keterangan}</p>}
                                        <p className="text-xs text-text-secondary">{tanggalIndo(t.tanggal)}{t.creator?.name ? ` • ${t.creator.name}` : ''}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        <p className={`whitespace-nowrap text-sm font-semibold ${t.tipe === 'keluar' ? 'text-danger' : 'text-success'}`}>
                                            {t.tipe === 'keluar' ? '−' : '+'} {rupiah(t.nominal)}
                                        </p>
                                        <button onClick={() => hapusTransaksi(t)} className="mt-1 text-xs font-semibold text-danger hover:underline">Hapus</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="h-fit overflow-hidden rounded-xl2 bg-white shadow-sm lg:col-span-2">
                    <p className="px-5 pb-2 pt-4 font-bold text-primary">Rekonsiliasi Kas Kurir (COD)</p>
                    <ul className="divide-y divide-gray-100">
                        {reconciliations.length === 0 && <li className="px-5 py-6 text-center text-sm text-text-secondary">Belum ada setoran di periode ini.</li>}
                        {reconciliations.map((r) => (
                            <li key={r.id} className="px-5 py-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">{r.courier?.nama}</p>
                                        <p className="text-xs text-text-secondary">{tanggalIndo(r.tanggal)}</p>
                                    </div>
                                    {Number(r.selisih) === 0
                                        ? <Badge color="success">Pas</Badge>
                                        : <Badge color="danger">{Number(r.selisih) > 0 ? '+' : ''}{rupiah(r.selisih)}</Badge>}
                                </div>
                                <p className="mt-1 text-xs text-text-secondary">Tagihan {rupiah(r.total_tagihan)} • Diterima {rupiah(r.uang_fisik_diterima)}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </AdminLayout>
    );
}
