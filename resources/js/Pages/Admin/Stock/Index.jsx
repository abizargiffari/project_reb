import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

function Kpi({ label, value, tone = 'primary' }) {
    return (
        <div className="bg-white rounded-xl2 shadow-sm p-4">
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`text-xl font-bold mt-1 ${tone === 'danger' ? 'text-danger' : 'text-primary'}`}>{value}</p>
        </div>
    );
}

function FormMovement({ product, onClose }) {
    const { data, setData, post, processing, errors } = useForm({ tipe: 'masuk', qty: '', keterangan: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.stock.movement', product.id), { preserveScroll: true, onSuccess: onClose });
    }

    return (
        <form onSubmit={submit} className="bg-cream rounded-xl p-3 mt-2">
            <div className="grid grid-cols-3 gap-2 mb-2">
                <select className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" value={data.tipe} onChange={(e) => setData('tipe', e.target.value)}>
                    <option value="masuk">Stok Masuk</option>
                    <option value="keluar">Stok Keluar</option>
                    <option value="susut">Susut/Rusak</option>
                </select>
                <input type="number" min="1" placeholder="Jumlah" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" value={data.qty} onChange={(e) => setData('qty', e.target.value)} />
                <input placeholder="Keterangan (opsional)" className="border border-gray-200 rounded-lg px-2 py-1.5 text-sm" value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} />
            </div>
            {errors.qty && <p className="text-xs text-danger mb-2">{errors.qty}</p>}
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold">Simpan</button>
                <button type="button" onClick={onClose} className="px-3 py-1.5 text-xs font-semibold text-text-secondary">Batal</button>
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

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Stok & Sayuran</h1>
                <p className="text-sm text-text-secondary">Catat pergerakan stok manual (restock pasar, susut/rusak) di luar transaksi pesanan.</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <Kpi label="Total Produk" value={ringkasan.total_produk} />
                <Kpi label="Stok Kritis" value={ringkasan.stok_kritis} tone={ringkasan.stok_kritis > 0 ? 'danger' : 'primary'} />
                <Kpi label="Nilai Stok (Modal)" value={rupiah(ringkasan.nilai_stok)} />
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl2 shadow-sm p-4 mb-4 flex flex-wrap items-center gap-3">
                        <input
                            type="text" placeholder="Cari nama produk / SKU..."
                            value={data.search} onChange={(e) => applyFilter({ search: e.target.value })}
                            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[160px]"
                        />
                        <select value={data.category_id} onChange={(e) => applyFilter({ category_id: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                            <option value="">Semua Kategori</option>
                            {categories.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                        </select>
                        <label className="flex items-center gap-2 text-sm text-text-secondary">
                            <input type="checkbox" checked={!!data.hanya_kritis} onChange={(e) => applyFilter({ hanya_kritis: e.target.checked })} />
                            Hanya Stok Kritis
                        </label>
                    </div>

                    <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                        <table className="w-full text-sm">
                            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                                <tr>
                                    <th className="px-4 py-3">Produk</th>
                                    <th className="px-4 py-3">Stok</th>
                                    <th className="px-4 py-3">Nilai (Modal)</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.data.length === 0 && (
                                    <tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Tidak ada produk ditemukan.</td></tr>
                                )}
                                {products.data.map((p) => (
                                    <tr key={p.id} className="border-t border-gray-100 align-top">
                                        <td className="px-4 py-3">
                                            <p className="font-semibold">{p.nama}</p>
                                            <p className="text-xs text-text-secondary">{p.category?.nama} • {p.sku}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {p.is_low_stock ? <Badge color="danger">{p.stok} {p.satuan} (Kritis)</Badge> : <span>{p.stok} {p.satuan}</span>}
                                        </td>
                                        <td className="px-4 py-3 text-text-secondary">{rupiah(p.stok * p.harga_modal)}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button onClick={() => setBukaForm(bukaForm === p.id ? null : p.id)} className="text-primary text-xs font-semibold">
                                                {bukaForm === p.id ? 'Tutup' : 'Catat Pergerakan'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {products.data.map((p) => bukaForm === p.id && (
                            <div key={`form-${p.id}`} className="px-4 pb-4">
                                <FormMovement product={p} onClose={() => setBukaForm(null)} />
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-1 mt-4">
                        {products.links.map((link, i) => (
                            <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                                className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-xl2 shadow-sm overflow-hidden h-fit">
                    <p className="font-bold text-primary px-5 pt-4 pb-2">Riwayat Pergerakan Terkini</p>
                    <div className="divide-y divide-gray-50 max-h-[600px] overflow-y-auto">
                        {riwayatTerkini.length === 0 && <p className="px-5 py-4 text-sm text-text-secondary">Belum ada riwayat.</p>}
                        {riwayatTerkini.map((r) => (
                            <div key={r.id} className="px-5 py-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="font-semibold">{r.product?.nama}</span>
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
