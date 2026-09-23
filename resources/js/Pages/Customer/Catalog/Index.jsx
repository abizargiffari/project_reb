import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Index({ products, categories, filters }) {
    const { data, setData } = useForm({
        kategori: filters.kategori ?? '',
        satuan: filters.satuan ?? '',
        hanya_stok_tersedia: filters.hanya_stok_tersedia ?? false,
        urutan: filters.urutan ?? '',
        q: filters.q ?? '',
    });

    function applyFilter(newData) {
        const merged = { ...data, ...newData };
        setData(merged);
        router.get(route('catalog.index'), merged, { preserveState: true, replace: true });
    }

    function tambahKeKeranjang(product) {
        router.post(route('cart.store'), { product_id: product.id, qty: 1 }, { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title="Katalog Belanja Segar" />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Katalog Belanja Segar</p>
                <h1 className="text-2xl md:text-3xl font-bold text-primary mb-6">Pilih Kebutuhan Dapur Pagi Ini</h1>

                {/* Filter kategori */}
                <div className="flex gap-2 overflow-x-auto mb-4">
                    <button
                        onClick={() => applyFilter({ kategori: '' })}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${!data.kategori ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                    >
                        Semua Sayur
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.slug}
                            onClick={() => applyFilter({ kategori: cat.slug })}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap ${data.kategori === cat.slug ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}
                        >
                            {cat.nama}
                        </button>
                    ))}
                </div>

                {/* Toolbar */}
                <div className="bg-white rounded-xl2 shadow-sm p-3 mb-6 flex flex-wrap items-center gap-3 text-sm">
                    <select value={data.satuan} onChange={(e) => applyFilter({ satuan: e.target.value })} className="border border-gray-200 rounded-lg px-3 py-1.5">
                        <option value="">Semua Satuan</option>
                        <option value="ikat">Ikat</option>
                        <option value="kg">Kg/Gram</option>
                        <option value="bungkus">Bungkus/Paket</option>
                    </select>
                    <label className="flex items-center gap-2 text-text-secondary">
                        <input type="checkbox" checked={!!data.hanya_stok_tersedia} onChange={(e) => applyFilter({ hanya_stok_tersedia: e.target.checked })} />
                        Hanya Stok Tersedia
                    </label>
                    <select value={data.urutan} onChange={(e) => applyFilter({ urutan: e.target.value })} className="ml-auto border border-gray-200 rounded-lg px-3 py-1.5">
                        <option value="">Urutkan: Paling Laris</option>
                        <option value="terbaru">Terbaru</option>
                        <option value="harga_rendah">Harga Terendah</option>
                        <option value="harga_tinggi">Harga Tertinggi</option>
                    </select>
                </div>

                {/* Grid produk */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {products.data.map((product) => (
                        <div key={product.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden flex flex-col">
                            <Link href={route('product.show', product.slug)} className="block relative aspect-square bg-cream">
                                {product.gambar && (
                                    <img src={`/storage/${product.gambar}`} alt={product.nama} className="w-full h-full object-cover" />
                                )}
                                {product.badge && (
                                    <span className="absolute top-2 left-2">
                                        <Badge color="orange">{product.badge}</Badge>
                                    </span>
                                )}
                            </Link>
                            <div className="p-3 flex-1 flex flex-col">
                                <p className="text-xs text-text-secondary">{product.category?.nama}</p>
                                <Link href={route('product.show', product.slug)} className="font-semibold text-sm mt-1 line-clamp-2">
                                    {product.nama}
                                </Link>
                                <div className="mt-2">
                                    <span className="font-bold text-primary">Rp {Number(product.harga_jual).toLocaleString('id-ID')}</span>
                                    <span className="text-xs text-text-secondary"> /{product.satuan}</span>
                                    {product.harga_coret && (
                                        <span className="text-xs text-gray-400 line-through ml-1">
                                            Rp {Number(product.harga_coret).toLocaleString('id-ID')}
                                        </span>
                                    )}
                                </div>
                                {product.catatan_stok && (
                                    <p className="text-xs text-text-secondary mt-1">● {product.catatan_stok}</p>
                                )}

                                {product.stok > 0 ? (
                                    <button
                                        onClick={() => tambahKeKeranjang(product)}
                                        className="mt-3 w-full border border-primary text-primary rounded-lg py-2 text-sm font-semibold hover:bg-primary hover:text-white transition"
                                    >
                                        + Tambah
                                    </button>
                                ) : (
                                    <button disabled className="mt-3 w-full bg-gray-100 text-gray-400 rounded-lg py-2 text-sm font-semibold cursor-not-allowed">
                                        Habis Pagi Ini
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-1 mt-8">
                    {products.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`}
                        />
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
