import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ banners, produk }) {
    function tambahKeKeranjang(product) {
        router.post(route('cart.store'), { product_id: product.id, qty: 1 }, { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title="Promo & Diskon Hari Ini" />
            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-1">Promo & Diskon Hari Ini</h1>
                <p className="text-sm text-text-secondary mb-6">Semua produk dengan harga spesial, dikumpulkan di satu halaman.</p>

                {banners.length > 0 && (
                    <div className="mb-8 grid md:grid-cols-2 gap-4">
                        {banners.map((b) => (
                            <Link key={b.id} href={b.link ?? '#'} className="rounded-xl2 overflow-hidden bg-cream block aspect-[3/1]">
                                {b.gambar && <img src={`/storage/${b.gambar}`} alt={b.judul} className="w-full h-full object-cover" />}
                            </Link>
                        ))}
                    </div>
                )}

                {produk.length === 0 ? (
                    <p className="text-text-secondary">Belum ada promo aktif saat ini. Cek lagi besok pagi!</p>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {produk.map((p) => (
                            <div key={p.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden flex flex-col">
                                <Link href={route('product.show', p.slug)} className="block relative aspect-square bg-cream">
                                    {p.gambar && <img src={`/storage/${p.gambar}`} alt={p.nama} className="w-full h-full object-cover" />}
                                    <span className="absolute top-2 left-2"><Badge color="orange">DISKON</Badge></span>
                                </Link>
                                <div className="p-3 flex-1 flex flex-col">
                                    <p className="text-xs text-text-secondary">{p.category?.nama}</p>
                                    <Link href={route('product.show', p.slug)} className="font-semibold text-sm mt-1 line-clamp-2">{p.nama}</Link>
                                    <p className="mt-2">
                                        <span className="font-bold text-primary">{rupiah(p.harga_jual)}</span>
                                        <span className="text-xs text-gray-400 line-through ml-1">{rupiah(p.harga_coret)}</span>
                                    </p>
                                    {p.stok > 0 ? (
                                        <button onClick={() => tambahKeKeranjang(p)} className="mt-3 w-full border border-primary text-primary rounded-lg py-2 text-sm font-semibold hover:bg-primary hover:text-white transition">+ Tambah</button>
                                    ) : (
                                        <button disabled className="mt-3 w-full bg-gray-100 text-gray-400 rounded-lg py-2 text-sm font-semibold">Habis</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
