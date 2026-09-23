import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link } from '@inertiajs/react';

function KpiCard({ label, value, sub, color = 'primary' }) {
    return (
        <div className="bg-white rounded-xl2 shadow-sm p-5">
            <p className="text-xs text-text-secondary">{label}</p>
            <p className={`text-2xl font-bold mt-1 ${color === 'danger' ? 'text-danger' : 'text-primary'}`}>{value}</p>
            {sub && <p className="text-xs text-text-secondary mt-1">{sub}</p>}
        </div>
    );
}

const statusColor = {
    baru: 'neutral',
    diproses: 'orange',
    diantar: 'orange',
    selesai: 'success',
    dibatalkan: 'danger',
};

export default function Overview({ kpis, pesananTerkini }) {
    const rupiah = (n) => 'Rp ' + Number(n ?? 0).toLocaleString('id-ID');

    return (
        <AdminLayout>
            <Head title="Overview" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Dashboard</p>
                <h1 className="text-2xl font-bold text-primary">Overview Lapak Hari Ini</h1>
                <p className="text-sm text-text-secondary">Ringkasan cepat performa Warung Sayur Pulungan.</p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <KpiCard label="Omzet Hari Ini" value={rupiah(kpis.omzet_hari_ini)} />
                <KpiCard label="Pesanan Masuk" value={kpis.pesanan_masuk} sub="pesanan hari ini" />
                <KpiCard label="Stok Kritis" value={kpis.stok_kritis} sub="produk perlu restock" color={kpis.stok_kritis > 0 ? 'danger' : 'primary'} />
                <KpiCard label="Tagihan COD Belum Lunas" value={rupiah(kpis.tagihan_cod)} />
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <p className="font-bold text-primary">Pesanan Terkini</p>
                    <Link href={route('admin.orders.index')} className="text-sm text-primary font-semibold hover:underline">
                        Lihat Semua →
                    </Link>
                </div>
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-5 py-3">No. Order</th>
                            <th className="px-5 py-3">Pelanggan</th>
                            <th className="px-5 py-3">Kloter</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pesananTerkini.length === 0 && (
                            <tr><td colSpan={5} className="px-5 py-6 text-center text-text-secondary">Belum ada pesanan masuk.</td></tr>
                        )}
                        {pesananTerkini.map((order) => (
                            <tr key={order.id} className="border-t border-gray-100">
                                <td className="px-5 py-3 font-semibold">{order.order_number}</td>
                                <td className="px-5 py-3">{order.user?.name}</td>
                                <td className="px-5 py-3 text-text-secondary">{order.delivery_batch?.nama_kloter}</td>
                                <td className="px-5 py-3 font-semibold text-primary">{rupiah(order.total)}</td>
                                <td className="px-5 py-3">
                                    <Badge color={statusColor[order.status_pesanan] ?? 'neutral'}>{order.status_pesanan}</Badge>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
