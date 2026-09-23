import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ products, categories, filters }) {
    const { data, setData } = useForm({
        search: filters.search ?? '',
        category_id: filters.category_id ?? '',
        status: filters.status ?? '',
        stok_kritis: filters.stok_kritis ?? false,
    });

    function applyFilter(newData) {
        const merged = { ...data, ...newData };
        setData(merged);
        router.get(route('admin.produk.index'), merged, { preserveState: true, replace: true });
    }

    function hapus(product) {
        if (confirm(`Nonaktifkan produk "${product.nama}"?`)) {
            router.delete(route('admin.produk.destroy', product.id));
        }
    }

    return (
        <AdminLayout>
            <Head title="Manajemen Produk" />

            <div className="flex items-center justify-between mb-6">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Katalog</p>
                    <h1 className="text-2xl font-bold text-primary">Manajemen Produk</h1>
                    <p className="text-sm text-text-secondary">Kelola daftar sayur, harga, dan stok yang tampil di katalog pelanggan.</p>
                </div>
                <Link
                    href={route('admin.produk.create')}
                    className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-primary-dark"
                >
                    + Tambah Produk
                </Link>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
                <input
                    type="text"
                    placeholder="Cari nama produk / SKU..."
                    value={data.search}
                    onChange={(e) => applyFilter({ search: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:border-primary"
                />
                <select
                    value={data.category_id}
                    onChange={(e) => applyFilter({ category_id: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">Semua Kategori</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.nama}</option>
                    ))}
                </select>
                <select
                    value={data.status}
                    onChange={(e) => applyFilter({ status: e.target.value })}
                    className="border border-gray-200 rounded-lg px-3 py-2 text-sm"
                >
                    <option value="">Semua Status</option>
                    <option value="aktif">Aktif</option>
                    <option value="nonaktif">Nonaktif</option>
                </select>
                <label className="flex items-center gap-2 text-sm text-text-secondary">
                    <input
                        type="checkbox"
                        checked={!!data.stok_kritis}
                        onChange={(e) => applyFilter({ stok_kritis: e.target.checked })}
                    />
                    Hanya Stok Kritis
                </label>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-cream text-left text-xs uppercase tracking-wide text-text-secondary">
                        <tr>
                            <th className="px-4 py-3">Produk</th>
                            <th className="px-4 py-3">Kategori</th>
                            <th className="px-4 py-3">Harga Jual</th>
                            <th className="px-4 py-3">Margin</th>
                            <th className="px-4 py-3">Stok</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.data.map((product) => (
                            <tr key={product.id} className="border-t border-gray-100">
                                <td className="px-4 py-3">
                                    <p className="font-semibold">{product.nama}</p>
                                    <p className="text-xs text-text-secondary">{product.sku}</p>
                                </td>
                                <td className="px-4 py-3 text-text-secondary">{product.category?.nama}</td>
                                <td className="px-4 py-3 font-semibold text-primary">
                                    Rp {Number(product.harga_jual).toLocaleString('id-ID')} / {product.satuan}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge color="success">{product.margin_persen ?? '-'}%</Badge>
                                </td>
                                <td className="px-4 py-3">
                                    {product.is_low_stock ? (
                                        <Badge color="danger">{product.stok} (Kritis)</Badge>
                                    ) : (
                                        <span>{product.stok}</span>
                                    )}
                                </td>
                                <td className="px-4 py-3">
                                    <Badge color={product.status === 'aktif' ? 'success' : 'neutral'}>
                                        {product.status === 'aktif' ? 'Aktif' : 'Nonaktif'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-3 text-right space-x-2">
                                    <Link href={route('admin.produk.edit', product.id)} className="text-primary font-semibold hover:underline">
                                        Edit
                                    </Link>
                                    <button onClick={() => hapus(product)} className="text-danger font-semibold hover:underline">
                                        Nonaktifkan
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex justify-center gap-1 mt-4">
                {products.links.map((link, i) => (
                    <Link
                        key={i}
                        href={link.url ?? '#'}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`px-3 py-1.5 rounded-lg text-sm ${
                            link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'
                        } ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                    />
                ))}
            </div>
        </AdminLayout>
    );
}
