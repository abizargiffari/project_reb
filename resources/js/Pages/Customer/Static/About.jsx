import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { Head } from '@inertiajs/react';

const fitur = [
    {
        judul: 'Timbangan Amanah',
        deskripsi: 'Semua produk ditimbang dengan timbangan digital terkalibrasi — berat yang Anda bayar adalah berat yang Anda terima, tidak dikurangi.',
    },
    {
        judul: 'Garansi Ganti di Pagar',
        deskripsi: 'Sayur layu atau rusak saat diterima? Foto kondisinya dan ajukan retur lewat Riwayat Pesanan — kami ganti baru tanpa biaya tambahan.',
    },
    {
        judul: 'Bisa Bayar COD atau QRIS',
        deskripsi: 'Bayar tunai langsung ke kurir (titip pagar), atau transfer otomatis lewat QRIS maupun Virtual Account — pilih yang paling nyaman.',
    },
];

export default function About({ toko }) {
    return (
        <CustomerLayout>
            <Head title="Tentang Kami" />

            <div className="mx-auto max-w-3xl px-4 py-10">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-2xl"></div>
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Tentang {toko.nama}</h1>
                        {toko.tagline && <p className="text-sm text-text-secondary">{toko.tagline}</p>}
                    </div>
                </div>

                <div className="bg-white rounded-xl2 shadow-sm p-6 mb-6">
                    <p className="text-sm text-gray-700 leading-relaxed">
                        {toko.nama} adalah usaha warung sayur keluarga yang melayani kebutuhan dapur harian warga
                        {toko.area_layanan ? ` sekitar ${toko.area_layanan}` : ' sekitar Ciganjur dan Jagakarsa'}.
                        Setiap pagi, sayur dipetik langsung dari petani lokal dan diantar segar ke depan pagar rumah
                        oleh kurir yang sudah dikenal warga — bukan kurir anonim dari aplikasi besar. Kami percaya
                        belanja sayur seharusnya semudah dan sejujur belanja ke warung tetangga, hanya saja kini bisa
                        dipesan lewat ponsel.
                    </p>

                    {(toko.alamat || toko.telepon || toko.jam_operasional) && (
                        <div className="mt-5 pt-5 border-t border-gray-100 grid sm:grid-cols-2 gap-3 text-sm">
                            {toko.alamat && (
                                <div>
                                    <p className="text-xs text-text-secondary">Alamat</p>
                                    <p className="font-medium">{toko.alamat}</p>
                                </div>
                            )}
                            {toko.telepon && (
                                <div>
                                    <p className="text-xs text-text-secondary">Telepon / WhatsApp</p>
                                    <p className="font-medium">{toko.telepon}</p>
                                </div>
                            )}
                            {toko.jam_operasional && (
                                <div>
                                    <p className="text-xs text-text-secondary">Jam Operasional</p>
                                    <p className="font-medium">{toko.jam_operasional}</p>
                                </div>
                            )}
                            {toko.area_layanan && (
                                <div>
                                    <p className="text-xs text-text-secondary">Area Layanan</p>
                                    <p className="font-medium">{toko.area_layanan}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="grid sm:grid-cols-3 gap-4 mb-6">
                    {fitur.map((f) => (
                        <div key={f.judul} className="bg-white rounded-xl2 shadow-sm p-5">
                            <div className="text-2xl mb-2">{f.ikon}</div>
                            <p className="font-bold text-sm mb-1">{f.judul}</p>
                            <p className="text-xs text-text-secondary leading-relaxed">{f.deskripsi}</p>
                        </div>
                    ))}
                </div>

                <div className="bg-cream rounded-xl2 p-5">
                    <p className="text-xs font-semibold text-primary mb-3">Metode Pembayaran yang Kami Terima</p>
                    <div className="flex flex-wrap gap-2">
                        <Badge color="success">QRIS</Badge>
                        <Badge color="orange">Tunai / COD</Badge>
                        <Badge color="neutral">Virtual Account Bank</Badge>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
