import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';
import { useMemo, useState } from 'react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

export default function Index({ orders, batches, filters }) {
    const { data, setData } = useForm({
        tanggal: filters.tanggal,
        delivery_batch_id: filters.delivery_batch_id ?? '',
    });
    const [dipilih, setDipilih] = useState([]);
    const [fokus, setFokus] = useState(orders[0]?.id ?? null);

    function applyFilter(newData) {
        const merged = { ...data, ...newData };
        setData(merged);
        router.get(route('admin.print.index'), merged, { preserveState: true, replace: true });
    }

    function toggle(id) {
        setDipilih((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }

    function toggleSemua() {
        setDipilih(dipilih.length === orders.length ? [] : orders.map((o) => o.id));
    }

    function cetakSatu(id) {
        window.open(route('admin.print.struk', id) + '?auto=1', '_blank', 'width=400,height=700');
    }

    function cetakTerpilih() {
        if (dipilih.length === 0) return;
        window.open(`${route('admin.print.struk-batch')}?ids=${dipilih.join(',')}`, '_blank');
    }

    const previewUrl = useMemo(
        () => (fokus ? `${route('admin.print.struk', fokus)}?embed=1` : null),
        [fokus]
    );

    return (
        <AdminLayout>
            <Head title="Cetak Invoice & Struk" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Cetak Invoice & Label</h1>
                <p className="text-sm text-text-secondary">Pilih pesanan untuk dicetak satu per satu atau sekaligus per kloter.</p>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm p-4 mb-4 flex flex-wrap items-end gap-3">
                <div>
                    <label className="block text-xs font-semibold mb-1">Tanggal</label>
                    <input type="date" value={data.tanggal} onChange={(e) => applyFilter({ tanggal: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                    <label className="block text-xs font-semibold mb-1">Kloter</label>
                    <select value={data.delivery_batch_id} onChange={(e) => applyFilter({ delivery_batch_id: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">Semua Kloter</option>
                        {batches.map((b) => <option key={b.id} value={b.id}>{b.nama_kloter}</option>)}
                    </select>
                </div>
                <button
                    onClick={cetakTerpilih}
                    disabled={dipilih.length === 0}
                    className="ml-auto bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-40"
                >
                    🖨 Cetak Terpilih ({dipilih.length})
                </button>
            </div>

            <div className="grid lg:grid-cols-5 gap-6">
                {/* Panel kiri: daftar pesanan */}
                <div className="lg:col-span-3 bg-white rounded-xl2 shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                            <tr>
                                <th className="px-3 py-3 w-8">
                                    <input type="checkbox" checked={orders.length > 0 && dipilih.length === orders.length} onChange={toggleSemua} />
                                </th>
                                <th className="px-3 py-3">No. Order</th>
                                <th className="px-3 py-3">Pelanggan</th>
                                <th className="px-3 py-3">Kloter</th>
                                <th className="px-3 py-3">Total</th>
                                <th className="px-3 py-3">Status</th>
                                <th className="px-3 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.length === 0 && (
                                <tr><td colSpan={7} className="px-3 py-6 text-center text-text-secondary">Tidak ada pesanan untuk tanggal/kloter ini.</td></tr>
                            )}
                            {orders.map((o) => (
                                <tr
                                    key={o.id}
                                    onClick={() => setFokus(o.id)}
                                    className={`border-t border-gray-100 cursor-pointer ${fokus === o.id ? 'bg-cream' : ''}`}
                                >
                                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                                        <input type="checkbox" checked={dipilih.includes(o.id)} onChange={() => toggle(o.id)} />
                                    </td>
                                    <td className="px-3 py-3 font-semibold">{o.order_number}</td>
                                    <td className="px-3 py-3">{o.user?.name}</td>
                                    <td className="px-3 py-3 text-text-secondary">{o.delivery_batch?.nama_kloter}</td>
                                    <td className="px-3 py-3 font-semibold text-primary">{rupiah(o.total)}</td>
                                    <td className="px-3 py-3"><Badge color={statusColor[o.status_pesanan]}>{o.status_pesanan}</Badge></td>
                                    <td className="px-3 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => cetakSatu(o.id)} className="text-primary font-semibold hover:underline text-sm">
                                            Cetak
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Panel kanan: preview struk */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl2 shadow-sm p-4 lg:sticky lg:top-6">
                        <p className="font-bold text-primary mb-3 text-sm">Pratinjau Struk</p>
                        {previewUrl ? (
                            <iframe
                                key={previewUrl}
                                src={previewUrl}
                                title="Pratinjau Struk"
                                className="w-full border border-gray-200 rounded-lg"
                                style={{ height: '70vh' }}
                            />
                        ) : (
                            <p className="text-sm text-text-secondary text-center py-10">Klik salah satu baris pesanan untuk melihat pratinjau struknya.</p>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
