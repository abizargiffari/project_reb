import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };
const perluBayar = (o) => o.metode_bayar !== 'cod' && o.status_pembayaran === 'pending' && o.status_pesanan !== 'dibatalkan';

function labelBayar(o) {
    const metode = o.metode_bayar === 'cod' ? 'COD' : o.metode_bayar.toUpperCase();
    const status = { lunas: 'Lunas', gagal: 'Gagal' }[o.status_pembayaran] ?? (o.metode_bayar === 'cod' ? 'Bayar di tempat' : 'Belum dibayar');
    return `${metode} • ${status}`;
}

export default function Orders({ orders }) {
    return (
        <CustomerLayout>
            <Head title="Riwayat Pesanan" />

            <div className="mx-auto max-w-3xl px-4 py-8">
                <h1 className="mb-6 text-2xl font-bold text-primary">Riwayat Pesanan</h1>

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
                            <div key={o.id} className="overflow-hidden rounded-xl2 bg-white shadow-sm">
                                <Link href={route('account.orders.show', o.id)} className="block p-4 transition hover:bg-cream/60">
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="min-w-0 break-all text-sm font-bold text-primary sm:text-base">{o.order_number}</p>
                                        <Badge color={statusColor[o.status_pesanan]}>{o.status_pesanan}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-text-secondary">
                                        {o.items_count} item • {o.delivery_batch?.nama_kloter} • {new Date(o.created_at).toLocaleDateString('id-ID')}
                                    </p>
                                    <p className="mt-1 text-xs text-text-secondary">{labelBayar(o)}</p>
                                    <p className="mt-1 font-semibold text-primary">{rupiah(o.total)}</p>
                                </Link>

                                {perluBayar(o) && (
                                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-orange-100 bg-orange-50 px-4 py-2.5">
                                        <p className="text-xs font-semibold text-orange-900">Menunggu pembayaran</p>
                                        <Link href={route('checkout.success', o.id)} className="whitespace-nowrap rounded-lg bg-accent-orange px-4 py-1.5 text-xs font-bold text-white">
                                            Bayar Sekarang
                                        </Link>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                <div className="mt-6 flex flex-wrap justify-center gap-1">
                    {orders.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
