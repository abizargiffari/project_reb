import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ categories }) {
    function hapus(category) {
        if (confirm(`Hapus kategori "${category.nama}"?`)) {
            router.delete(route('admin.kategori.destroy', category.id));
        }
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Kategori" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-primary">Manajemen Kategori</h1>
                    <p className="text-sm text-text-secondary">Kelompok produk yang tampil sebagai filter di katalog pelanggan.</p>
                </div>
                <Link href={route('admin.kategori.create')} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    + Tambah Kategori
                </Link>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">Nama Kategori</th>
                            <th className="px-4 py-3">Jumlah Produk</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((cat) => (
                            <tr key={cat.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-semibold">{cat.nama}</td>
                                <td className="px-4 py-3 text-text-secondary">{cat.products_count} produk</td>
                                <td className="px-4 py-3">{cat.status_aktif ? 'Aktif' : 'Nonaktif'}</td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link href={route('admin.kategori.edit', cat.id)} className="text-primary font-semibold hover:underline">Edit</Link>
                                    <button onClick={() => hapus(cat)} className="text-danger font-semibold hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
