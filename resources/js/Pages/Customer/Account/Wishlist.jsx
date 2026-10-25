import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import WishlistButton from '@/Components/UI/WishlistButton';
import { rupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';

export default function Wishlist({ produk }) {
    function tambahKeKeranjang(product) {
        router.post(route('cart.store'), { product_id: product.id, qty: 1 }, { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title="Wishlist Saya" />

            <div className="mx-auto max-w-7xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary">Wishlist Saya</h1>
                <p className="mb-6 text-sm text-text-secondary">Produk yang Anda simpan untuk dibeli nanti.</p>

                {produk.length === 0 ? (
                    <div className="rounded-xl2 bg-white p-10 text-center shadow-sm">
                        <p className="font-semibold text-primary">Wishlist Anda masih kosong</p>
                        <p className="mt-1 text-sm text-text-secondary">Tekan ikon hati di produk mana pun untuk menyimpannya di sini.</p>
                        <Link href={route('catalog.index')} className="mt-5 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark">
                            Lihat Katalog
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {produk.map((p) => (
                            <div key={p.id} className="relative flex flex-col overflow-hidden rounded-xl2 bg-white shadow-sm">
                                <Link href={route('product.show', p.slug)} className="relative block aspect-square bg-cream">
                                    {p.gambar && <img src={`/storage/${p.gambar}`} alt={p.nama} loading="lazy" className="h-full w-full object-cover" />}
                                    {p.badge && <span className="absolute left-2 top-2"><Badge color="orange">{p.badge}</Badge></span>}
                                </Link>
                                <WishlistButton productId={p.id} />
                                <div className="flex flex-1 flex-col p-3">
                                    <p className="text-xs text-text-secondary">{p.category?.nama}</p>
                                    <Link href={route('product.show', p.slug)} className="mt-1 line-clamp-2 text-sm font-semibold">{p.nama}</Link>
                                    <p className="mt-2">
                                        <span className="font-bold text-primary">{rupiah(p.harga_jual)}</span>
                                        <span className="text-xs text-text-secondary"> /{p.satuan}</span>
                                    </p>
                                    {p.stok > 0 ? (
                                        <button onClick={() => tambahKeKeranjang(p)} className="mt-3 w-full rounded-lg border border-primary py-2 text-sm font-semibold text-primary transition hover:bg-primary hover:text-white">
                                            + Tambah
                                        </button>
                                    ) : (
                                        <button disabled className="mt-3 w-full cursor-not-allowed rounded-lg bg-gray-100 py-2 text-sm font-semibold text-gray-400">
                                            Habis Pagi Ini
                                        </button>
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
