import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
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
                <div className="md:col-span-2 relative rounded-xl2 overflow-hidden bg-primary min-h-[340px] flex flex-col justify-end p-8 text-white">
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight max-w-md">
                        Sayur Panen Subuh Langsung ke Pagar Rumah
                    </h1>
                    <p className="text-white/80 mt-2 max-w-md text-sm">
                        Bebas biaya komisi aplikasi, harga jujur setara warung tetangga, dan garansi ganti baru di tempat jika ada sayur layu.
                    </p>
                    <div className="flex gap-3 mt-6">
                        <Link href={route('catalog.index')} className="bg-accent-orange text-white px-6 py-3 rounded-xl font-semibold">
                            Mulai Pilih Belanjaan
                        </Link>
                        <button className="border border-white text-white px-6 py-3 rounded-xl font-semibold">
                            Sayur Busuk? Ganti Tanpa Ribet
                        </button>
                    </div>
                </div>

                <div className="bg-white rounded-xl2 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-primary">Rute Antar Jagakarsa & Ciganjur</p>
                        <Badge>Hari Ini</Badge>
                    </div>
                    <p className="text-xs text-text-secondary mb-4">Ongkir flat Rp 2.000 (khusus Ciganjur, Jagakarsa, Cipedak & Lenteng Agung)</p>

                    <div className="space-y-3">
                        {deliveryBatches.map((batch, i) => (
                            <div key={batch.id} className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-cream text-primary font-bold text-xs flex items-center justify-center flex-shrink-0">
                                    {i + 1}
                                </div>
                                <div className="flex-1">
                                    <p className="font-semibold text-sm">{batch.nama_kloter}</p>
                                    <p className="text-xs text-text-secondary">{batch.jam_mulai} - {batch.jam_selesai} WIB</p>
                                </div>
                                <Badge color={batch.sisa_slot <= 5 ? 'orange' : 'success'}>
                                    {batch.sisa_slot <= 5 ? `Sisa ${batch.sisa_slot} Slot` : 'Slot Dibuka'}
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>
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
                        <div key={product.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden flex flex-col">
                            <Link href={route('product.show', product.slug)} className="block relative aspect-square bg-cream">
                                {product.gambar && <img src={`/storage/${product.gambar}`} alt={product.nama} className="w-full h-full object-cover" />}
                                {product.badge && <span className="absolute top-2 left-2"><Badge color="orange">{product.badge}</Badge></span>}
                            </Link>
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

            {/* Paket Hemat */}
            {packages.length > 0 && (
                <section className="bg-[#EFE7D8] py-10">
                    <div className="max-w-7xl mx-auto px-4">
                        <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Solusi Cepat Dapur Pagi</p>
                        <h2 className="text-2xl font-bold text-primary mb-6">Paket Hemat Masak Harian</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {packages.map((pkg) => (
                                <div key={pkg.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                                    <div className="aspect-video bg-cream">
                                        {pkg.gambar && <img src={`/storage/${pkg.gambar}`} alt={pkg.nama} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="p-4">
                                        <p className="font-bold">{pkg.nama}</p>
                                        <p className="text-xs text-text-secondary mt-1 line-clamp-2">{pkg.deskripsi}</p>
                                        <p className="mt-2">
                                            <span className="font-bold text-primary">Rp {Number(pkg.harga_diskon).toLocaleString('id-ID')}</span>
                                            {pkg.harga_coret && <span className="text-xs text-gray-400 line-through ml-2">Rp {Number(pkg.harga_coret).toLocaleString('id-ID')}</span>}
                                        </p>
                                        <button className="mt-3 w-full bg-primary text-white rounded-lg py-2.5 text-sm font-semibold">
                                            🛒 Beli 1 Paket Langsung Masak
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Testimoni */}
            {testimonials.length > 0 && (
                <section className="max-w-7xl mx-auto px-4 py-10">
                    <h2 className="text-xl font-bold text-primary mb-4">Apa Kata Tetangga Sekitar</h2>
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
