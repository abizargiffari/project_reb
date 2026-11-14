import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function Kpi({ label, value, tone = 'primary', className = '' }) {
    return (
        <div className={`rounded-xl2 bg-white p-4 shadow-sm ${className}`}>
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`mt-1 break-words text-lg font-bold sm:text-xl ${tone === 'danger' ? 'text-danger' : 'text-primary'}`}>{value}</p>
        </div>
    );
}

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none';

function FormMovement({ product, onClose }) {
    const { data, setData, post, processing, errors } = useForm({ tipe: 'masuk', qty: '', keterangan: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.stock.movement', product.id), { preserveScroll: true, onSuccess: onClose });
    }

    return (
        <form onSubmit={submit} className="mt-3 rounded-xl bg-cream p-3">
            <div className="grid gap-2 sm:grid-cols-3">
                <select className={inputClass} value={data.tipe} onChange={(e) => setData('tipe', e.target.value)} aria-label="Jenis pergerakan">
                    <option value="masuk">Stok Masuk</option>
                    <option value="keluar">Stok Keluar</option>
                    <option value="susut">Susut/Rusak</option>
                </select>
                <input type="number" min="1" inputMode="numeric" placeholder="Jumlah" className={inputClass} value={data.qty} onChange={(e) => setData('qty', e.target.value)} aria-label="Jumlah" />
                <input placeholder="Keterangan (opsional)" className={inputClass} value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} aria-label="Keterangan" />
            </div>
            {errors.qty && <p className="mt-2 text-xs text-danger">{errors.qty}</p>}
            <div className="mt-3 flex gap-2">
                <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white disabled:opacity-50">Simpan</button>
                <button type="button" onClick={onClose} className="px-3 py-2 text-xs font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ products, categories, filters, ringkasan, riwayatTerkini }) {
    const { data, setData } = useForm({
        search: filters.search ?? '', category_id: filters.category_id ?? '', hanya_kritis: filters.hanya_kritis ?? false,
    });
    const [bukaForm, setBukaForm] = useState(null);

    function applyFilter(newData) {
        const merged = { ...data, ...newData };
        setData(merged);
        router.get(route('admin.stock.index'), merged, { preserveState: true, replace: true });
    }

    return (
        <AdminLayout>
            <Head title="Stok & Sayuran" />

            <div className="mb-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Stok & Sayuran</h1>
                <p className="text-sm text-text-secondary">Catat pergerakan stok manual (restock pasar, susut/rusak) di luar transaksi pesanan.</p>
            </div>

            {/* Nilai stok paling panjang angkanya -> melebar penuh di HP */}
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4">
                <Kpi label="Total Produk" value={ringkasan.total_produk} />
                <Kpi label="Stok Kritis" value={ringkasan.stok_kritis} tone={ringkasan.stok_kritis > 0 ? 'danger' : 'primary'} />
                <Kpi label="Nilai Stok (Modal)" value={rupiah(ringkasan.nilai_stok)} className="col-span-2 sm:col-span-1" />
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <div className="mb-4 flex flex-col gap-3 rounded-xl2 bg-white p-4 shadow-sm sm:flex-row sm:flex-wrap sm:items-center">
                        <input
                            type="search" placeholder="Cari nama produk / SKU..."
                            value={data.search} onChange={(e) => applyFilter({ search: e.target.value })}
                            className={inputClass + ' sm:min-w-[160px] sm:flex-1'}
                        />
                        <select value={data.category_id} onChange={(e) => applyFilter({ category_id: e.target.value })} className={inputClass + ' sm:w-auto'}>
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-text-secondary">
                            <input type="checkbox" checked={!!data.hanya_kritis} onChange={(e) => applyFilter({ hanya_kritis: e.target.checked })} />
                            Hanya Stok Kritis
                        </label>
                    </div>

                    {/* Daftar (bukan tabel): tidak butuh geser samping dan form tampil tepat di bawah produknya */}
                    <ul className="divide-y divide-gray-100 rounded-xl2 bg-white shadow-sm">
                        {products.data.length === 0 && (
                            <li className="p-6 text-center text-sm text-text-secondary">Tidak ada produk ditemukan.</li>
                        )}
                        {products.data.map((p) => (
                            <li key={p.id} className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <p className="font-semibold leading-snug">{p.nama}</p>
                                        <p className="mt-0.5 break-words text-xs text-text-secondary">{p.category?.nama} • {p.sku}</p>
                                    </div>
                                    <div className="flex-shrink-0 text-right">
                                        {p.is_low_stock
                                            ? <Badge color="danger">{p.stok} {p.satuan} • Kritis</Badge>
                                            : <p className="text-sm font-semibold">{p.stok} {p.satuan}</p>}
                                        <p className="mt-0.5 text-xs text-text-secondary">{rupiah(p.stok * p.harga_modal)}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setBukaForm(bukaForm === p.id ? null : p.id)}
                                    className="mt-3 w-full rounded-lg border border-primary py-2 text-xs font-semibold text-primary sm:w-auto sm:px-4"
                                >
                                    {bukaForm === p.id ? 'Tutup' : 'Catat Pergerakan'}
                                </button>

                                {bukaForm === p.id && <FormMovement product={p} onClose={() => setBukaForm(null)} />}
                            </li>
                        ))}
                    </ul>

                    <div className="mt-4 flex flex-wrap justify-center gap-1">
                        {products.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />
                        ))}
                    </div>
                </div>

                <div className="h-fit overflow-hidden rounded-xl2 bg-white shadow-sm">
                    <p className="px-5 pb-2 pt-4 font-bold text-primary">Riwayat Pergerakan Terkini</p>
                    <div className="max-h-[600px] divide-y divide-gray-50 overflow-y-auto">
                        {riwayatTerkini.length === 0 && <p className="px-5 py-4 text-sm text-text-secondary">Belum ada riwayat.</p>}
                        {riwayatTerkini.map((r) => (
                            <div key={r.id} className="px-5 py-3 text-sm">
                                <div className="flex items-start justify-between gap-2">
                                    <span className="min-w-0 break-words font-semibold">{r.product?.nama}</span>
                                    <Badge color={r.tipe === 'masuk' ? 'success' : r.tipe === 'susut' ? 'danger' : 'orange'}>{r.tipe}</Badge>
                                </div>
                                <p className="text-xs text-text-secondary">{r.qty} • {r.sumber}</p>
                                <p className="text-xs text-text-secondary">{new Date(r.created_at).toLocaleString('id-ID')} {r.creator && `• ${r.creator.name}`}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
