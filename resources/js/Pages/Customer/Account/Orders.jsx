import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

export default function Orders({ orders }) {
    return (
        <CustomerLayout>
            <Head title="Riwayat Pesanan" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-6">Riwayat Pesanan</h1>

                {orders.data.length === 0 ? (
                    <div className="rounded-xl2 bg-white p-10 text-center shadow-sm">
                        <p className="text-text-secondary">Belum ada pesanan.</p>
                        <Link href={route('catalog.index')} className="mt-4 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white">
                            Mulai Belanja
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.data.map((o) => (
                            <Link
                                key={o.id}
                                href={route('account.orders.show', o.id)}
                                className="block rounded-xl2 bg-white p-4 shadow-sm hover:shadow-md transition"
                            >
                                <div className="flex items-center justify-between">
                                    <p className="font-bold text-primary">{o.order_number}</p>
                                    <Badge color={statusColor[o.status_pesanan]}>{o.status_pesanan}</Badge>
                                </div>
                                <p className="text-sm text-text-secondary mt-1">
                                    {o.items_count} item • {o.delivery_batch?.nama_kloter} • {new Date(o.created_at).toLocaleDateString('id-ID')}
                                </p>
                                <p className="font-semibold text-primary mt-1">{rupiah(o.total)}</p>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="flex justify-center gap-1 mt-6">
                    {orders.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
