import CustomerLayout from '@/Layouts/CustomerLayout';
import { rupiah } from '@/Utils/format';
import { Head, Link, router } from '@inertiajs/react';

export default function Index({ items, subtotal }) {
    const adaMasalah = items.some((i) => i.product.status !== 'aktif' || i.qty > i.product.stok);

    function ubahQty(item, qty) {
        if (qty < 1) return;
        router.patch(route('cart.update', item.id), { qty }, { preserveScroll: true });
    }

    function hapus(item) {
        router.delete(route('cart.destroy', item.id), { preserveScroll: true });
    }

    return (
        <CustomerLayout>
            <Head title="Keranjang Belanja" />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-1 text-2xl font-bold text-primary">Keranjang Belanja</h1>
                <p className="mb-6 text-sm text-text-secondary">Periksa kembali belanjaan sebelum lanjut ke pembayaran.</p>

                {items.length === 0 ? (
                    <div className="rounded-xl2 bg-white p-10 text-center shadow-sm">
                        <p className="font-semibold text-primary">Keranjang kamu masih kosong</p>
                        <p className="mt-1 text-sm text-text-secondary">Yuk pilih sayur segar untuk dapur pagi ini.</p>
                        <Link
                            href={route('catalog.index')}
                            className="mt-5 inline-block rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
                        >
                            Mulai Pilih Belanjaan
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6 lg:grid-cols-3">
                        <div className="space-y-3 lg:col-span-2">
                            {items.map((item) => {
                                const habis = item.product.status !== 'aktif' || item.product.stok < 1;
                                const kelebihan = !habis && item.qty > item.product.stok;

                                return (
                                    <div key={item.id} className="flex gap-4 rounded-xl2 bg-white p-4 shadow-sm">
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-cream">
                                            {item.product.gambar && (
                                                <img src={`/storage/${item.product.gambar}`} alt={item.product.nama} className="h-full w-full object-cover" />
                                            )}
                                        </div>

                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs text-text-secondary">{item.product.kategori}</p>
                                            <Link href={route('product.show', item.product.slug)} className="line-clamp-2 text-sm font-semibold">
                                                {item.product.nama}
                                            </Link>
                                            <p className="mt-1 text-sm text-text-secondary">
                                                {rupiah(item.product.harga_jual)} / {item.product.satuan}
                                            </p>

                                            {habis && <p className="mt-1 text-xs font-semibold text-danger">Produk ini sedang habis. Hapus dari keranjang untuk melanjutkan.</p>}
                                            {kelebihan && <p className="mt-1 text-xs font-semibold text-danger">Stok tinggal {item.product.stok}. Kurangi jumlahnya.</p>}

                                            <div className="mt-3 flex items-center justify-between">
                                                <div className="flex items-center rounded-lg border border-gray-200">
                                                    <button onClick={() => ubahQty(item, item.qty - 1)} disabled={item.qty <= 1} aria-label="Kurangi" className="h-8 w-8 text-lg disabled:opacity-30">−</button>
                                                    <span className="w-8 text-center text-sm font-semibold">{item.qty}</span>
                                                    <button onClick={() => ubahQty(item, item.qty + 1)} disabled={habis || item.qty >= item.product.stok} aria-label="Tambah" className="h-8 w-8 text-lg disabled:opacity-30">+</button>
                                                </div>
                                                <button onClick={() => hapus(item)} className="text-xs font-semibold text-danger hover:underline">Hapus</button>
                                            </div>
                                        </div>

                                        <p className="whitespace-nowrap text-sm font-bold text-primary">{rupiah(item.subtotal)}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="h-fit rounded-xl2 bg-white p-5 shadow-sm lg:sticky lg:top-6">
                            <p className="font-bold text-primary">Ringkasan</p>
                            <div className="mt-4 flex justify-between text-sm">
                                <span className="text-text-secondary">Subtotal Produk</span>
                                <span className="font-semibold">{rupiah(subtotal)}</span>
                            </div>
                            <p className="mt-2 text-xs text-text-secondary">Ongkir, biaya penanganan, dan voucher dihitung di halaman berikutnya.</p>

                            {adaMasalah ? (
                                <button disabled className="mt-5 w-full cursor-not-allowed rounded-xl bg-gray-200 py-3 text-sm font-semibold text-gray-500">
                                    Perbaiki keranjang dulu
                                </button>
                            ) : (
                                <Link href={route('checkout.index')} className="mt-5 block w-full rounded-xl bg-primary py-3 text-center text-sm font-semibold text-white hover:bg-primary-dark">
                                    Lanjut ke Pembayaran
                                </Link>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
