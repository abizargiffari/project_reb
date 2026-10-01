import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

const statusColor = { diajukan: 'orange', disetujui: 'success', ditolak: 'danger' };

export default function Index({ returns, filters }) {
    const { data, setData } = useForm({ status: filters.status ?? '' });

    function applyFilter(v) {
        setData('status', v);
        router.get(route('admin.returns.index'), { status: v }, { preserveState: true, replace: true });
    }

    function proses(r, status) {
        const label = status === 'disetujui' ? 'MENYETUJUI (akan tercatat sebagai kas keluar)' : 'MENOLAK';
        if (!confirm(`Yakin ${label} retur untuk "${r.product?.nama}" pada pesanan ${r.order?.order_number}?`)) return;
        router.patch(route('admin.returns.update', r.id), { status }, { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Retur" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Manajemen Retur & Komplain</h1>
                <p className="text-sm text-text-secondary">Retur yang disetujui otomatis tercatat sebagai kas keluar di Modul Keuangan.</p>
            </div>

            <div className="flex gap-2 mb-4">
                {[['', 'Semua'], ['diajukan', 'Menunggu'], ['disetujui', 'Disetujui'], ['ditolak', 'Ditolak']].map(([v, label]) => (
                    <button
                        key={v}
                        onClick={() => applyFilter(v)}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium ${data.status === v ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                    >
                        {label}
                    </button>
                ))}
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">No. Order</th>
                            <th className="px-4 py-3">Pelanggan</th>
                            <th className="px-4 py-3">Produk</th>
                            <th className="px-4 py-3">Alasan</th>
                            <th className="px-4 py-3">Bukti</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {returns.data.length === 0 && (
                            <tr><td colSpan={7} className="px-4 py-6 text-center text-text-secondary">Tidak ada pengajuan retur.</td></tr>
                        )}
                        {returns.data.map((r) => (
                            <tr key={r.id} className="border-t border-gray-100 align-top">
                                <td className="px-4 py-3 font-semibold">{r.order?.order_number}</td>
                                <td className="px-4 py-3">{r.order?.user?.name}</td>
                                <td className="px-4 py-3">{r.product?.nama}</td>
                                <td className="px-4 py-3 text-text-secondary max-w-xs">{r.alasan}</td>
                                <td className="px-4 py-3">
                                    {r.foto_bukti ? (
                                        <a href={`/storage/${r.foto_bukti}`} target="_blank" rel="noreferrer">
                                            <img src={`/storage/${r.foto_bukti}`} alt="Bukti" className="w-14 h-14 object-cover rounded-lg" />
                                        </a>
                                    ) : <span className="text-xs text-text-secondary">—</span>}
                                </td>
                                <td className="px-4 py-3"><Badge color={statusColor[r.status]}>{r.status}</Badge></td>
                                <td className="px-4 py-3 text-right">
                                    {r.status === 'diajukan' ? (
                                        <div className="flex flex-col gap-1 items-end">
                                            <button onClick={() => proses(r, 'disetujui')} className="text-success font-semibold hover:underline text-xs">Setujui</button>
                                            <button onClick={() => proses(r, 'ditolak')} className="text-danger font-semibold hover:underline text-xs">Tolak</button>
                                        </div>
                                    ) : (
                                        <Link href={route('admin.orders.show', r.order_id)} className="text-primary text-xs font-semibold hover:underline">Lihat Order</Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {returns.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
