import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ posts, filters }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });

    function cari(v) {
        setData('search', v);
        router.get(route('admin.blog.index'), { search: v }, { preserveState: true, replace: true });
    }

    function hapus(p) {
        if (confirm(`Hapus artikel "${p.judul}"?`)) router.delete(route('admin.blog.destroy', p.id));
    }

    return (
        <AdminLayout>
            <Head title="Blog & Artikel" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Konten</p>
                    <h1 className="text-2xl font-bold text-primary">Blog & Artikel</h1>
                </div>
                <Link href={route('admin.blog.create')} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">+ Tulis Artikel</Link>
            </div>

            <input type="text" placeholder="Cari judul..." value={data.search} onChange={(e) => cari(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 w-full max-w-sm" />

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr><th className="px-4 py-3">Judul</th><th className="px-4 py-3">Penulis</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Aksi</th></tr>
                    </thead>
                    <tbody>
                        {posts.data.length === 0 && (<tr><td colSpan={4} className="px-4 py-6 text-center text-text-secondary">Belum ada artikel.</td></tr>)}
                        {posts.data.map((p) => (
                            <tr key={p.id} className="border-t border-gray-100">
                                <td className="px-4 py-3 font-semibold">{p.judul}</td>
                                <td className="px-4 py-3 text-text-secondary">{p.author?.name}</td>
                                <td className="px-4 py-3">
                                    <Badge color={p.published_at ? 'success' : 'neutral'}>{p.published_at ? 'Terbit' : 'Draft'}</Badge>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link href={route('admin.blog.edit', p.id)} className="text-primary font-semibold hover:underline">Edit</Link>
                                    <button onClick={() => hapus(p)} className="text-danger font-semibold hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {posts.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
