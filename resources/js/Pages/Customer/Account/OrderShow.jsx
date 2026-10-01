import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

function FormRetur({ order, item }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        product_id: item.product_id,
        alasan: '',
        foto_bukti: null,
    });

    function submit(e) {
        e.preventDefault();
        post(route('account.orders.return.store', order.id), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    }

    return (
        <form onSubmit={submit} className="mt-3 rounded-xl bg-cream p-3">
            <label className="block text-xs font-semibold mb-1">Ceritakan apa yang bermasalah</label>
            <textarea
                required rows={2}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                placeholder="Contoh: bayam layu dan berair saat diterima"
                value={data.alasan}
                onChange={(e) => setData('alasan', e.target.value)}
            />
            {errors.alasan && <p className="text-xs text-danger mt-1">{errors.alasan}</p>}

            <label className="block text-xs font-semibold mb-1 mt-2">Foto Bukti (opsional)</label>
            <input type="file" accept="image/*" onChange={(e) => setData('foto_bukti', e.target.files[0])} className="text-sm" />
            {errors.foto_bukti && <p className="text-xs text-danger mt-1">{errors.foto_bukti}</p>}

            <button type="submit" disabled={processing} className="mt-3 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-white disabled:opacity-50">
                {processing ? 'Mengirim...' : 'Kirim Pengajuan Retur'}
            </button>
        </form>
    );
}

export default function OrderShow({ order }) {
    const { flash } = usePage().props;
    const [formTerbuka, setFormTerbuka] = useState(null);

    const bisaRetur = order.status_pesanan === 'selesai';

    function sudahDiajukan(productId) {
        return order.returns.some((r) => r.product_id === productId && r.status !== 'ditolak');
    }

    return (
        <CustomerLayout>
            <Head title={order.order_number} />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-xl font-bold text-primary">{order.order_number}</h1>
                        <p className="text-sm text-text-secondary">{new Date(order.created_at).toLocaleString('id-ID')}</p>
                    </div>
                    <Badge color={statusColor[order.status_pesanan]}>{order.status_pesanan}</Badge>
                </div>

                {flash?.success && <div className="mb-4 rounded-xl bg-success-light px-4 py-3 text-sm font-medium text-success">{flash.success}</div>}
                {flash?.error && <div className="mb-4 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger">{flash.error}</div>}

                <div className="rounded-xl2 bg-white p-5 shadow-sm mb-4">
                    <p className="text-sm"><span className="text-text-secondary">Kloter:</span> {order.delivery_batch?.nama_kloter}</p>
                    <p className="text-sm"><span className="text-text-secondary">Alamat:</span> {order.address?.alamat_lengkap}</p>
                    <p className="text-sm"><span className="text-text-secondary">Kurir:</span> {order.courier?.nama ?? '-'}</p>
                </div>

                <div className="rounded-xl2 bg-white p-5 shadow-sm">
                    <p className="font-bold text-primary mb-3">Item Pesanan</p>
                    <div className="space-y-4">
                        {order.items.map((item) => (
                            <div key={item.id} className="border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex justify-between text-sm">
                                    <span>{item.qty} × {item.nama_produk_snapshot}</span>
                                    <span className="font-semibold">{rupiah(item.subtotal)}</span>
                                </div>

                                {bisaRetur && item.product_id && (
                                    sudahDiajukan(item.product_id) ? (
                                        <p className="mt-2 text-xs font-semibold text-accent-orange">Retur sudah diajukan untuk produk ini.</p>
                                    ) : formTerbuka === item.id ? (
                                        <FormRetur order={order} item={item} />
                                    ) : (
                                        <button onClick={() => setFormTerbuka(item.id)} className="mt-2 text-xs font-semibold text-danger hover:underline">
                                            Ada masalah dengan produk ini? Ajukan retur
                                        </button>
                                    )
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
                        <div className="flex justify-between"><span className="text-text-secondary">Subtotal</span><span>{rupiah(order.subtotal)}</span></div>
                        <div className="flex justify-between"><span className="text-text-secondary">Ongkir</span><span>{Number(order.ongkir) === 0 ? 'GRATIS' : rupiah(order.ongkir)}</span></div>
                        <div className="flex justify-between font-bold text-primary pt-1"><span>Total</span><span>{rupiah(order.total)}</span></div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
