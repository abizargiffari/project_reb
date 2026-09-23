import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

export default function Show({ product, produkTerkait }) {
    const { data, setData, processing } = useForm({ qty: 1 });

    function tambahKeKeranjang() {
        router.post(route('cart.store'), { product_id: product.id, qty: data.qty }, { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title={product.nama} />

            <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
                <div className="aspect-square bg-white rounded-xl2 shadow-sm overflow-hidden relative">
                    {product.gambar && <img src={`/storage/${product.gambar}`} alt={product.nama} className="w-full h-full object-cover" />}
                    {product.badge && (
                        <span className="absolute top-3 left-3"><Badge color="orange">{product.badge}</Badge></span>
                    )}
                </div>

                <div>
                    <p className="text-xs text-text-secondary">{product.category?.nama}</p>
                    <h1 className="text-2xl font-bold text-primary mt-1">{product.nama}</h1>

                    <div className="mt-3">
                        <span className="text-3xl font-bold text-primary">Rp {Number(product.harga_jual).toLocaleString('id-ID')}</span>
                        <span className="text-text-secondary"> /{product.satuan}</span>
                        {product.harga_coret && (
                            <span className="text-gray-400 line-through ml-2">Rp {Number(product.harga_coret).toLocaleString('id-ID')}</span>
                        )}
                    </div>

                    {product.catatan_stok && <p className="text-sm text-text-secondary mt-2">● {product.catatan_stok}</p>}

                    <p className="text-sm text-gray-600 mt-4 leading-relaxed">{product.deskripsi}</p>

                    {product.stok > 0 ? (
                        <div className="flex items-center gap-3 mt-6">
                            <input
                                type="number"
                                min={1}
                                max={product.stok}
                                value={data.qty}
                                onChange={(e) => setData('qty', e.target.value)}
                                className="w-20 border border-gray-200 rounded-lg px-3 py-2 text-sm text-center"
                            />
                            <button
                                onClick={tambahKeKeranjang}
                                disabled={processing}
                                className="flex-1 bg-primary text-white rounded-xl py-3 font-semibold hover:bg-primary-dark disabled:opacity-50"
                            >
                                Tambah ke Keranjang
                            </button>
                        </div>
                    ) : (
                        <button disabled className="mt-6 w-full bg-gray-100 text-gray-400 rounded-xl py-3 font-semibold cursor-not-allowed">
                            Habis Pagi Ini
                        </button>
                    )}
                </div>
            </div>

            {produkTerkait.length > 0 && (
                <div className="max-w-5xl mx-auto px-4 pb-12">
                    <h2 className="text-lg font-bold text-primary mb-4">Produk Sekategori Lainnya</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {produkTerkait.map((p) => (
                            <Link key={p.id} href={route('product.show', p.slug)} className="bg-white rounded-xl2 shadow-sm overflow-hidden block">
                                <div className="aspect-square bg-cream">
                                    {p.gambar && <img src={`/storage/${p.gambar}`} alt={p.nama} className="w-full h-full object-cover" />}
                                </div>
                                <div className="p-3">
                                    <p className="text-sm font-semibold line-clamp-2">{p.nama}</p>
                                    <p className="text-primary font-bold text-sm mt-1">Rp {Number(p.harga_jual).toLocaleString('id-ID')}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
