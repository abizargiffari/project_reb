import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

const statusColor = { baru: 'neutral', diproses: 'orange', diantar: 'orange', selesai: 'success', dibatalkan: 'danger' };

export default function Show({ customer, orders, ringkasan }) {
    return (
        <AdminLayout>
            <Head title={customer.name} />

            <div className="mb-6">
                <Link href={route('admin.customers.index')} className="text-sm text-text-secondary hover:text-primary">← Kembali ke daftar pelanggan</Link>
                <h1 className="text-2xl font-bold text-primary mt-1">{customer.name}</h1>
                <p className="text-sm text-text-secondary">{customer.email} • {customer.phone}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl2 shadow-sm p-4">
                    <p className="text-xs text-text-secondary">Total Pesanan</p>
                    <p className="text-xl font-bold text-primary">{ringkasan.total_pesanan}</p>
                </div>
                <div className="bg-white rounded-xl2 shadow-sm p-4">
                    <p className="text-xs text-text-secondary">Total Belanja (Lunas)</p>
                    <p className="text-xl font-bold text-primary">{rupiah(ringkasan.total_belanja)}</p>
                </div>
                <div className="bg-white rounded-xl2 shadow-sm p-4">
                    <p className="text-xs text-text-secondary">Retur Diajukan</p>
                    <p className="text-xl font-bold text-primary">{ringkasan.retur_diajukan}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <p className="font-bold text-primary px-5 pt-4 pb-2">Riwayat Pesanan</p>
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr><th className="px-4 py-2">No. Order</th><th className="px-4 py-2">Kloter</th><th className="px-4 py-2">Total</th><th className="px-4 py-2">Status</th></tr>
                    </thead>
                    <tbody>
                        {orders.data.map((o) => (
                            <tr key={o.id} className="border-t border-gray-100">
                                <td className="px-4 py-2 font-semibold">
                                    <Link href={route('admin.orders.show', o.id)} className="hover:underline">{o.order_number}</Link>
                                </td>
                                <td className="px-4 py-2 text-text-secondary">{o.delivery_batch?.nama_kloter}</td>
                                <td className="px-4 py-2 font-semibold text-primary">{rupiah(o.total)}</td>
                                <td className="px-4 py-2"><Badge color={statusColor[o.status_pesanan]}>{o.status_pesanan}</Badge></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
