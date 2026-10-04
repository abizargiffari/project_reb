import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ packages, filters }) {
    const { data, setData } = useForm({ search: filters.search ?? '' });

    function cari(v) {
        setData('search', v);
        router.get(route('admin.paket.index'), { search: v }, { preserveState: true, replace: true });
    }

    function hapus(p) {
        if (confirm(`Hapus paket "${p.nama}"?`)) router.delete(route('admin.paket.destroy', p.id));
    }

    return (
        <AdminLayout>
            <Head title="Paket Hemat" />

            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Katalog</p>
                    <h1 className="text-2xl font-bold text-primary">Paket Hemat Masak Harian</h1>
                    <p className="text-sm text-text-secondary">Bundel beberapa produk jadi satu paket dengan harga spesial.</p>
                </div>
                <Link href={route('admin.paket.create')} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">+ Buat Paket</Link>
            </div>

            <input type="text" placeholder="Cari nama paket..." value={data.search} onChange={(e) => cari(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm mb-4 w-full max-w-sm" />

            <div className="grid md:grid-cols-3 gap-4">
                {packages.data.length === 0 && <p className="text-text-secondary text-sm">Belum ada paket.</p>}
                {packages.data.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                        <div className="aspect-video bg-cream">
                            {p.gambar && <img src={`/storage/${p.gambar}`} alt={p.nama} className="w-full h-full object-cover" />}
                        </div>
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-bold text-sm">{p.nama}</p>
                                <Badge color={p.status === 'aktif' ? 'success' : 'neutral'}>{p.status === 'aktif' ? 'Aktif' : 'Nonaktif'}</Badge>
                            </div>
                            <p className="text-xs text-text-secondary mb-2">{p.items_count} produk di dalam paket</p>
                            <p className="font-bold text-primary">
                                {rupiah(p.harga_diskon)}
                                {p.harga_coret && <span className="text-xs text-gray-400 line-through ml-2">{rupiah(p.harga_coret)}</span>}
                            </p>
                            <div className="flex gap-3 mt-3">
                                <Link href={route('admin.paket.edit', p.id)} className="text-primary text-xs font-semibold">Edit</Link>
                                <button onClick={() => hapus(p)} className="text-danger text-xs font-semibold">Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-center gap-1 mt-6">
                {packages.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
