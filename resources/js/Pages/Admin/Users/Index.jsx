import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

const roleBadge = { admin: 'primary', staff: 'orange', kurir: 'success' };
const roleLabel = { admin: 'Admin', staff: 'Staff', kurir: 'Kurir' };

export default function Index({ users, filters }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });

    function cari(v) {
        setData('search', v);
        router.get(route('admin.pengguna.index'), { search: v }, { preserveState: true, replace: true });
    }

    function hapus(u) {
        if (confirm(`Hapus pengguna "${u.name}"?`)) {
            router.delete(route('admin.pengguna.destroy', u.id));
        }
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Pengguna" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                    <h1 className="text-2xl font-bold text-primary">Manajemen Pengguna & Administrator</h1>
                    <p className="text-sm text-text-secondary">Kelola akun admin, staff, dan kurir. Pelanggan dikelola terpisah di menu Customer.</p>
                </div>
                <Link href={route('admin.pengguna.create')} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    + Tambah Pengguna
                </Link>
            </div>

            <input
                type="text" placeholder="Cari nama..."
                value={data.search} onChange={(e) => cari(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 w-full max-w-sm"
            />

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">Nama</th>
                            <th className="px-4 py-3">Email</th>
                            <th className="px-4 py-3">Role</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.length === 0 && (
                            <tr><td colSpan={5} className="px-4 py-6 text-center text-text-secondary">Tidak ada pengguna ditemukan.</td></tr>
                        )}
                        {users.data.map((u) => (
                            <tr key={u.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-semibold">{u.name}</td>
                                <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                                <td className="px-4 py-3"><Badge color={roleBadge[u.role]}>{roleLabel[u.role]}</Badge></td>
                                <td className="px-4 py-3">
                                    {u.role === 'kurir' && (
                                        <Badge color={u.courier_profile?.status_aktif ? 'success' : 'neutral'}>
                                            {u.courier_profile?.status_aktif ? 'Aktif' : 'Nonaktif'}
                                        </Badge>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link href={route('admin.pengguna.edit', u.id)} className="text-primary font-semibold hover:underline">Edit</Link>
                                    <button onClick={() => hapus(u)} className="text-danger font-semibold hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {users.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
