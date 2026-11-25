import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import WishlistButton from '@/Components/UI/WishlistButton';
import { Head, Link, router } from '@inertiajs/react';

export default function Home({ banners = [], deliveryBatches = [], featuredProducts = [], packages = [], testimonials = [] }) {
    function tambahKeKeranjang(product) {
        router.post(route('cart.store'), { product_id: product.id, qty: 1 }, { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title="Sayur Panen Subuh Langsung ke Pagar Rumah" />

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-4 pt-8 grid md:grid-cols-3 gap-6">
                <div
                    className="md:col-span-2 relative rounded-xl2 overflow-hidden bg-primary min-h-[340px] flex flex-col justify-end p-8 text-white bg-cover bg-center"
                    style={banners[0]?.gambar ? { backgroundImage: `linear-gradient(0deg, rgba(30,77,59,0.85), rgba(30,77,59,0.35)), url(/storage/${banners[0].gambar})` } : undefined}
                >
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-md">
                        {banners[0]?.judul ?? 'Sayur Panen Subuh Langsung ke Pagar Rumah'}
                    </h1>
                    <div className="flex gap-3 mt-6">
                        <Link href={banners[0]?.link ?? route('catalog.index')} className="bg-accent-orange text-white px-6 py-3 rounded-xl font-semibold">
                            Mulai Pilih Belanjaan
                        </Link>
                    </div>
                </div>

                {}
            </section>

            {/* Katalog Preview */}
            <section className="max-w-7xl mx-auto px-4 py-10">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Katalog Belanja Segar</p>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-primary">Pilih Kebutuhan Dapur Pagi Ini</h2>
                    <Link href={route('catalog.index')} className="text-primary text-sm font-semibold hover:underline">
                        Lihat Semua →
                    </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {featuredProducts.map((product) => (
                        <div key={product.id} className="relative bg-white rounded-xl2 shadow-sm overflow-hidden flex flex-col">
                            <Link href={route('product.show', product.slug)} className="block relative aspect-square bg-cream">
                                {product.gambar && <img src={`/storage/${product.gambar}`} alt={product.nama} className="w-full h-full object-cover" />}
                                {product.badge && <span className="absolute top-2 left-2 max-w-[calc(100%-3.5rem)]"><Badge color="orange">{product.badge}</Badge></span>}
                            </Link>
                            <WishlistButton productId={product.id} />
                            <div className="p-3 flex-1 flex flex-col">
                                <p className="text-xs text-text-secondary">{product.category?.nama}</p>
                                <Link href={route('product.show', product.slug)} className="font-semibold text-sm mt-1 line-clamp-2">{product.nama}</Link>
                                <p className="mt-2">
                                    <span className="font-bold text-primary">Rp {Number(product.harga_jual).toLocaleString('id-ID')}</span>
                                    <span className="text-xs text-text-secondary"> /{product.satuan}</span>
                                </p>
                                {product.stok > 0 ? (
                                    <button onClick={() => tambahKeKeranjang(product)} className="mt-3 w-full border border-primary text-primary rounded-lg py-2 text-sm font-semibold hover:bg-primary hover:text-white transition">
                                        + Tambah
                                    </button>
                                ) : (
                                    <button disabled className="mt-3 w-full bg-gray-100 text-gray-400 rounded-lg py-2 text-sm font-semibold">Habis Pagi Ini</button>
                                )}
                            </div>
                        </div>
                    ))}
                    {featuredProducts.length === 0 && (
                        <p className="col-span-4 text-center text-text-secondary py-8">Belum ada produk. Tambahkan produk lewat panel admin.</p>
                    )}
                </div>
            </section>

            {/* Testimoni */}
            {testimonials.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-10">
                    <h2 className="text-xl font-bold text-primary mb-4 ml-3">Apa Kata Tetangga Sekitar</h2>
                    <div className="grid md:grid-cols-2 gap-4">
                        {testimonials.map((t) => (
                            <div key={t.id} className="bg-white rounded-xl2 shadow-sm p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="font-bold">{t.nama}</p>
                                        <p className="text-xs text-text-secondary">{t.label}</p>
                                    </div>
                                    <span className="text-yellow-500 text-sm">{'★'.repeat(t.rating)}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-3">&ldquo;{t.isi}&rdquo;</p>
                                <p className="text-xs text-text-secondary mt-2">● {t.catatan}</p>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </CustomerLayout>
    );
}
