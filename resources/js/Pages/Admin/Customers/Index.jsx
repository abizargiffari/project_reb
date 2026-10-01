import AdminLayout from '@/Layouts/AdminLayout';
import { rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ customers, filters }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });

    function cari(v) {
        setData('search', v);
        router.get(route('admin.customers.index'), { search: v }, { preserveState: true, replace: true });
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Customer" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Manajemen Customer</h1>
                <p className="text-sm text-text-secondary">Daftar pelanggan beserta ringkasan transaksi mereka.</p>
            </div>

            <input
                type="text" placeholder="Cari nama / email..."
                value={data.search} onChange={(e) => cari(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 w-full max-w-sm"
            />

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Kontak</th>
                            <th className="px-4 py-3">Total Pesanan</th>
                            <th className="px-4 py-3">Total Belanja</th>
                            <th className="px-4 py-3">Pesanan Terakhir</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.data.length === 0 && (
                            <tr><td colSpan={6} className="px-4 py-6 text-center text-text-secondary">Tidak ada pelanggan ditemukan.</td></tr>
                        )}
                        {customers.data.map((c) => (
                            <tr key={c.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-semibold">{c.name}</td>
                                <td className="px-4 py-3 text-text-secondary">{c.email}<br /><span className="text-xs">{c.phone}</span></td>
                                <td className="px-4 py-3">{c.total_pesanan}</td>
                                <td className="px-4 py-3 font-semibold text-primary">{rupiah(c.total_belanja ?? 0)}</td>
                                <td className="px-4 py-3 text-text-secondary">
                                    {c.pesanan_terakhir ? new Date(c.pesanan_terakhir).toLocaleDateString('id-ID') : '-'}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link href={route('admin.customers.show', c.id)} className="text-primary font-semibold hover:underline">Detail</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {customers.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
