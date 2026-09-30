import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

const nextStatus = {
    baru: [{ v: 'diproses', label: 'Proses Pesanan' }, { v: 'dibatalkan', label: 'Batalkan' }],
    diproses: [{ v: 'diantar', label: 'Tandai Diantar' }, { v: 'dibatalkan', label: 'Batalkan' }],
    diantar: [{ v: 'selesai', label: 'Tandai Selesai' }, { v: 'dibatalkan', label: 'Batalkan' }],
    selesai: [],
    dibatalkan: [],
};

export default function Show({ order, couriers }) {
    const [courierId, setCourierId] = useState(order.courier_id ?? '');
    const { data, setData, patch, processing, errors } = useForm({ status_pesanan: '', keterangan: '' });

    function ubahStatus(status) {
        if (status === 'dibatalkan' && !confirm('Yakin batalkan pesanan ini? Stok, slot kloter, dan voucher akan dikembalikan.')) return;

        setData('status_pesanan', status);
        router.patch(route('admin.orders.update-status', order.id), { status_pesanan: status, keterangan: data.keterangan }, { preserveScroll: true });
    }

    function tugaskanKurir() {
        if (!courierId) return;
        router.post(route('admin.orders.assign-courier', order.id), { courier_id: courierId }, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title={`Pesanan ${order.order_number}`} />

            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                <div>
                    <h1 className="text-2xl font-bold text-primary">{order.order_number}</h1>
                    <p className="text-sm text-text-secondary">Dibuat {new Date(order.created_at).toLocaleString('id-ID')}</p>
                </div>
                <div className="flex gap-2">
                    <Badge color={statusColor[order.status_pesanan]}>{order.status_pesanan}</Badge>
                    <Badge color={order.status_pembayaran === 'lunas' ? 'success' : 'neutral'}>{order.status_pembayaran}</Badge>
                </div>
            </div>

            {errors.status_pesanan && <div className="mb-4 bg-danger-light text-danger px-4 py-3 rounded-xl text-sm">{errors.status_pesanan}</div>}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <div className="bg-white rounded-xl2 shadow-sm p-5">
                        <p className="font-bold text-primary mb-3">Item Pesanan</p>
                        <table className="w-full text-sm">
                            <tbody>
                                {order.items.map((i) => (
                                    <tr key={i.id} className="border-b border-gray-50">
                                        <td className="py-2">{i.nama_produk_snapshot}</td>
                                        <td className="py-2 text-text-secondary">{i.qty} × {rupiah(i.harga_satuan)}</td>
                                        <td className="py-2 text-right font-semibold">{rupiah(i.subtotal)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="mt-3 pt-3 border-t border-gray-100 space-y-1 text-sm">
                            <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span>{rupiah(order.subtotal)}</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Ongkir</span><span>{Number(order.ongkir) === 0 ? 'GRATIS' : rupiah(order.ongkir)}</span></div>
                            <div className="flex justify-between"><span className="text-text-secondary">Biaya Penanganan</span><span>{rupiah(order.biaya_kantong)}</span></div>
                            {Number(order.potongan_voucher) > 0 && <div className="flex justify-between text-success"><span>Potongan Voucher</span><span>− {rupiah(order.potongan_voucher)}</span></div>}
                            <div className="flex justify-between font-bold text-primary pt-1"><span>Total</span><span>{rupiah(order.total)}</span></div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl2 shadow-sm p-5">
                        <p className="font-bold text-primary mb-3">Riwayat Status</p>
                        <ol className="space-y-3">
                            {order.status_logs.map((log) => (
                                <li key={log.id} className="flex gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                                    <div>
                                        <p className="font-semibold capitalize">{log.status} {log.changed_by && <span className="text-text-secondary font-normal">oleh {log.changed_by.name}</span>}</p>
                                        {log.keterangan && <p className="text-text-secondary">{log.keterangan}</p>}
                                        <p className="text-xs text-text-secondary">{new Date(log.created_at).toLocaleString('id-ID')}</p>
                                    </div>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl2 shadow-sm p-5">
                        <p className="font-bold text-primary mb-3">Pengiriman</p>
                        <p className="text-sm"><span className="text-text-secondary">Kloter:</span> {order.delivery_batch?.nama_kloter}</p>
                        <p className="text-sm"><span className="text-text-secondary">Penerima:</span> {order.address?.nama_penerima}</p>
                        <p className="text-sm"><span className="text-text-secondary">Telepon:</span> {order.address?.telepon_penerima}</p>
                        <p className="text-sm"><span className="text-text-secondary">Alamat:</span> {order.address?.alamat_lengkap}</p>
                        {order.catatan_kurir && <p className="text-sm mt-1"><span className="text-text-secondary">Catatan:</span> {order.catatan_kurir}</p>}

                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <label className="block text-xs font-semibold mb-1.5">Tugaskan Kurir</label>
                            <div className="flex gap-2">
                                <select value={courierId} onChange={(e) => setCourierId(e.target.value)} className="flex-1 border border-gray-200 rounded-lg px-2 py-2 text-sm">
                                    <option value="">Pilih kurir</option>
                                    {couriers.map((c) => <option key={c.id} value={c.id}>{c.nama}</option>)}
                                </select>
                                <button onClick={tugaskanKurir} className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold">Simpan</button>
                            </div>
                            {order.courier && <p className="text-xs text-success mt-1.5">Saat ini: {order.courier.nama}</p>}
                        </div>
                    </div>

                    {nextStatus[order.status_pesanan]?.length > 0 && (
                        <div className="bg-white rounded-xl2 shadow-sm p-5">
                            <p className="font-bold text-primary mb-3">Ubah Status</p>
                            <input
                                type="text" placeholder="Keterangan (opsional)"
                                value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)}
                                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm mb-3"
                            />
                            <div className="flex flex-col gap-2">
                                {nextStatus[order.status_pesanan].map((s) => (
                                    <button
                                        key={s.v}
                                        onClick={() => ubahStatus(s.v)}
                                        disabled={processing}
                                        className={`rounded-lg py-2 text-sm font-semibold ${s.v === 'dibatalkan' ? 'border border-danger text-danger' : 'bg-primary text-white'}`}
                                    >
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
