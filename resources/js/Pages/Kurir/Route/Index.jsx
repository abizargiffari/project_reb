import Badge from '@/Components/UI/Badge';
import { jam, rupiah } from '@/Utils/format';
import { Head, Link, router, usePage } from '@inertiajs/react';

export default function Index({ courier, routes, tanggal }) {
    const { flash } = usePage().props;

    function ubahTanggal(t) {
        router.get(route('kurir.route.index'), { tanggal: t }, { preserveState: true, replace: true });
    }

    function selesaikan(order) {
        if (!confirm(`Tandai pesanan ${order.order_number} selesai diantar?`)) return;
        router.patch(route('kurir.order.complete', order.id), {}, { preserveScroll: true });
    }

    if (!courier) {
        return (
            <div className="min-h-screen bg-cream flex items-center justify-center p-5 text-center">
                <p className="text-text-secondary">Akun Anda belum terhubung ke profil kurir. Hubungi admin.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-cream pb-10">
            <Head title="Rute Pengantaran" />

            <header className="bg-primary text-white px-5 py-4 sticky top-0 z-10">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-xs text-white/70">Rute Pengantaran</p>
                        <p className="font-bold text-lg">{courier.nama}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link href={route('kurir.cash.index')} className="text-xs font-semibold text-white/90 underline">Kas</Link>
                        <Link href={route('logout')} method="post" as="button" className="text-xs font-semibold text-white/90 underline">
                            Keluar
                        </Link>
                    </div>
                </div>
                <input
                    type="date" value={tanggal} onChange={(e) => ubahTanggal(e.target.value)}
                    className="mt-2 rounded-lg px-2 py-1 text-sm text-primary"
                />
            </header>

            {flash?.success && <div className="m-4 bg-success-light text-success px-4 py-3 rounded-xl text-sm font-medium">{flash.success}</div>}
            {flash?.error && <div className="m-4 bg-danger-light text-danger px-4 py-3 rounded-xl text-sm font-medium">{flash.error}</div>}

            <main className="p-4 space-y-5">
                {routes.length === 0 && (
                    <div className="bg-white rounded-xl2 shadow-sm p-6 text-center text-sm text-text-secondary">
                        Belum ada rute yang ditugaskan untuk tanggal ini.
                    </div>
                )}

                {routes.map((route) => (
                    <section key={route.id}>
                        <div className="flex items-center justify-between mb-2">
                            <h2 className="font-bold text-primary">{route.delivery_batch?.nama_kloter}</h2>
                            <span className="text-xs text-text-secondary">{jam(route.delivery_batch?.jam_mulai)}–{jam(route.delivery_batch?.jam_selesai)} WIB</span>
                        </div>

                        <div className="space-y-3">
                            {route.stops.sort((a, b) => a.urutan - b.urutan).map((stop) => {
                                const o = stop.order;
                                const selesai = o.status_pesanan === 'selesai' || o.status_pesanan === 'dibatalkan';

                                return (
                                    <div key={stop.id} className="bg-white rounded-xl2 shadow-sm p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-7 h-7 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                                {stop.urutan}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center justify-between">
                                                    <p className="font-semibold text-sm">{o.address?.nama_penerima}</p>
                                                    <Badge color={o.status_pesanan === 'dibatalkan' ? 'danger' : selesai ? 'success' : 'neutral'}>
                                                        {o.status_pesanan}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs text-text-secondary mt-0.5">{o.address?.alamat_lengkap}</p>
                                                {o.address?.catatan_patokan && <p className="text-xs text-accent-orange mt-0.5">📍 {o.address.catatan_patokan}</p>}
                                                <p className="text-xs text-text-secondary mt-1">📞 {o.address?.telepon_penerima}</p>

                                                <div className="mt-2 flex items-center justify-between">
                                                    <div>
                                                        <Badge color={o.metode_bayar === 'cod' ? 'orange' : 'success'}>
                                                            {o.metode_bayar === 'cod' ? `COD ${rupiah(o.total)}` : 'Sudah Bayar'}
                                                        </Badge>
                                                    </div>
                                                    <a href={`tel:${o.address?.telepon_penerima}`} className="text-xs font-semibold text-primary">Telepon</a>
                                                </div>

                                                {!selesai && (
                                                    <button
                                                        onClick={() => selesaikan(o)}
                                                        className="mt-3 w-full bg-primary text-white rounded-lg py-2 text-sm font-semibold"
                                                    >
                                                        ✓ Tandai Selesai
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                ))}
            </main>
        </div>
    );
}
