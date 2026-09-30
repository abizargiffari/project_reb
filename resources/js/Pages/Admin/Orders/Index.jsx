import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

export default function Index({ orders, batches, couriers, filters }) {
    const { data, setData } = useForm({
        tanggal: filters.tanggal,
        delivery_batch_id: filters.delivery_batch_id ?? '',
        status_pesanan: filters.status_pesanan ?? '',
        search: filters.search ?? '',
    });
    const [courierRute, setCourierRute] = useState('');

    function applyFilter(newData) {
        const merged = { ...data, ...newData };
        setData(merged);
        router.get(route('admin.orders.index'), merged, { preserveState: true, replace: true });
    }

    function generateRute() {
        if (!data.delivery_batch_id || !courierRute) {
            alert('Pilih kloter dan kurir dulu.');
            return;
        }
        router.post(route('admin.orders.generate-route'), {
            delivery_batch_id: data.delivery_batch_id,
            tanggal: data.tanggal,
            courier_id: courierRute,
        }, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Pesanan & Rute" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Pesanan & Rute</h1>
                <p className="text-sm text-text-secondary">Pantau pesanan masuk dan tugaskan ke kurir per kloter.</p>
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
                <div>
                    <label className="block text-xs font-semibold mb-1">Status</label>
                    <select value={data.status_pesanan} onChange={(e) => applyFilter({ status_pesanan: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                        <option value="">Semua Status</option>
                        {['baru', 'diproses', 'diantar', 'selesai', 'dibatalkan'].map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <input
                    type="text" placeholder="Cari no. order / nama..."
                    value={data.search} onChange={(e) => applyFilter({ search: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 min-w-[180px]"
                />
            </div>

            <div className="bg-cream border border-dashed border-gray-300 rounded-xl2 p-4 mb-4 flex flex-wrap items-end gap-3">
                <p className="text-sm font-semibold text-primary w-full mb-1">🛵 Buat Rute Sekaligus (per kloter)</p>
                <p className="text-xs text-text-secondary w-full -mt-2 mb-1">
                    Menugaskan SEMUA pesanan kloter terpilih (tanggal & kloter dari filter di atas) yang belum ada kurirnya ke satu kurir.
                </p>
                <select value={courierRute} onChange={(e) => setCourierRute(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm">
                    <option value="">Pilih kurir</option>
                    {couriers.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                </select>
                <button onClick={generateRute} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">
                    Tugaskan Semua
                </button>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">No. Order</th>
                            <th className="px-4 py-3">Pelanggan</th>
                            <th className="px-4 py-3">Kloter</th>
                            <th className="px-4 py-3">Kurir</th>
                            <th className="px-4 py-3">Total</th>
                            <th className="px-4 py-3">Bayar</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.data.length === 0 && (
                            <tr><td colSpan={8} className="px-4 py-6 text-center text-text-secondary">Tidak ada pesanan untuk filter ini.</td></tr>
                        )}
                        {orders.data.map((o) => (
                            <tr key={o.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-semibold">{o.order_number}</td>
                                <td className="px-4 py-3">{o.user?.name}</td>
                                <td className="px-4 py-3 text-text-secondary">{o.delivery_batch?.nama_kloter}</td>
                                <td className="px-4 py-3 text-text-secondary">{o.courier?.nama ?? <span className="text-danger">Belum ada</span>}</td>
                                <td className="px-4 py-3 font-semibold text-primary">{rupiah(o.total)}</td>
                                <td className="px-4 py-3">
                                    <Badge color={o.status_pembayaran === 'lunas' ? 'success' : o.status_pembayaran === 'gagal' ? 'danger' : 'neutral'}>
                                        {o.status_pembayaran}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3"><Badge color={statusColor[o.status_pesanan]}>{o.status_pesanan}</Badge></td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={route('admin.orders.show', o.id)} className="text-primary font-semibold hover:underline">Detail</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {orders.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
