import CustomerLayout from '@/Layouts/CustomerLayout';
import { jam, rupiah } from '@/Utils/format';
import { Head, Link } from '@inertiajs/react';

const langkah = [
    { judul: 'Pilih produk', teks: 'Buka Katalog, cari sayur yang Anda butuhkan, lalu tekan "+ Tambah". Simpan produk favorit dengan ikon hati.' },
    { judul: 'Periksa keranjang', teks: 'Atur jumlah belanjaan di halaman Keranjang. Produk yang habis akan ditandai.' },
    { judul: 'Isi alamat pengiriman', teks: 'Masukkan nama, nomor WhatsApp, alamat, dan catatan patokan rumah (mis. "gantung di pagar hijau").' },
    { judul: 'Pilih jam antar', teks: 'Pilih salah satu kloter pengantaran. Kuota tiap kloter terbatas, jadi kloter yang penuh tidak bisa dipilih.' },
    { judul: 'Pilih cara bayar', teks: 'Bayar tunai ke kurir (COD), atau bayar online lewat QRIS / Virtual Account.' },
    { judul: 'Tunggu sayur sampai', teks: 'Pantau status pesanan di Riwayat Pesanan. Kurir mengantar sesuai jam kloter yang dipilih.' },
    { judul: 'Ada yang kurang segar?', teks: 'Ajukan retur dari halaman detail pesanan beserta foto. Tim kami akan meninjaunya.' },
];

export default function HowToOrder({ kloter, ongkir, gratisOngkirMinimal, biayaKantong }) {
    return (
        <CustomerLayout>
            <Head title="Cara Pemesanan" />

            <div className="mx-auto max-w-3xl px-4 py-10">
                <h1 className="text-2xl font-bold text-primary">Cara Pemesanan</h1>
                <p className="mb-8 mt-1 text-sm text-text-secondary">Belanja sayur segar dari rumah dalam beberapa langkah mudah.</p>

                <ol className="mb-10 space-y-3">
                    {langkah.map((l, i) => (
                        <li key={l.judul} className="flex gap-4 rounded-xl2 bg-white p-4 shadow-sm">
                            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{i + 1}</div>
                            <div>
                                <p className="font-bold">{l.judul}</p>
                                <p className="text-sm text-text-secondary">{l.teks}</p>
                            </div>
                        </li>
                    ))}
                </ol>

                <h2 className="mb-3 text-lg font-bold text-primary">Pilihan Pengiriman</h2>
                <div className="mb-3 overflow-hidden rounded-xl2 bg-white shadow-sm">
                    {kloter.length === 0 && <p className="p-4 text-sm text-text-secondary">Jadwal pengiriman akan segera diumumkan.</p>}
                    {kloter.map((k) => (
                        <div key={k.id} className="flex items-center justify-between border-b border-gray-50 px-4 py-3 text-sm last:border-0">
                            <span className="font-semibold">{k.nama_kloter}</span>
                            <span className="text-text-secondary">{jam(k.jam_mulai)} – {jam(k.jam_selesai)} WIB</span>
                        </div>
                    ))}
                </div>
                <p className="mb-10 text-sm text-text-secondary">
                    Ongkos kirim flat {rupiah(ongkir)}, <strong>gratis</strong> untuk belanja minimal {rupiah(gratisOngkirMinimal)}.
                    Ada biaya penanganan & kantong ramah lingkungan {rupiah(biayaKantong)} per pesanan.
                </p>

                <h2 className="mb-3 text-lg font-bold text-primary">Metode Pembayaran</h2>
                <div className="mb-10 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-xl2 bg-white p-4 shadow-sm">
                        <p className="font-bold">Bayar di Tempat (COD)</p>
                        <p className="mt-1 text-xs text-text-secondary">Bayar tunai ke kurir saat sayur tiba. Isi nominal uang yang disiapkan supaya kurir membawa kembalian.</p>
                    </div>
                    <div className="rounded-xl2 bg-white p-4 shadow-sm">
                        <p className="font-bold">QRIS</p>
                        <p className="mt-1 text-xs text-text-secondary">Scan dengan GoPay, ShopeePay, atau m-banking. Pesanan terkonfirmasi otomatis setelah dibayar.</p>
                    </div>
                    <div className="rounded-xl2 bg-white p-4 shadow-sm">
                        <p className="font-bold">Virtual Account</p>
                        <p className="mt-1 text-xs text-text-secondary">Transfer ke nomor VA bank pilihan Anda. Terverifikasi otomatis tanpa konfirmasi manual.</p>
                    </div>
                </div>
                <p className="mb-8 text-xs text-text-secondary">Pembayaran QRIS dan Virtual Account diproses aman oleh Midtrans. Kami tidak menyimpan data kartu atau rekening Anda.</p>

                <Link href={route('catalog.index')} className="inline-block rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark">
                    Mulai Belanja
                </Link>
            </div>
        </CustomerLayout>
    );
}
