import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';

function Section({ no, title, children }) {
    return (
        <div className="mb-6">
            <h2 className="font-bold text-primary mb-2">{no}. {title}</h2>
            <div className="text-sm text-gray-700 leading-relaxed space-y-2">{children}</div>
        </div>
    );
}

export default function Terms() {
    return (
        <CustomerLayout>
            <Head title="Syarat & Ketentuan" />
            <div className="mx-auto max-w-2xl px-4 py-10">
                <h1 className="text-2xl font-bold text-primary mb-1">Syarat & Ketentuan</h1>
                <p className="text-xs text-text-secondary mb-8">Terakhir diperbarui: Oktober 2026</p>

                <Section no="1" title="Tentang Layanan">
                    <p>
                        Warung Sayur Pulungan adalah layanan pemesanan sayur segar berbasis pengantaran area,
                        melayani wilayah Ciganjur, Jagakarsa, dan sekitarnya di Jakarta Selatan. Dengan menggunakan
                        situs ini, Anda dianggap telah membaca dan menyetujui seluruh syarat & ketentuan berikut.
                    </p>
                </Section>

                <Section no="2" title="Pemesanan & Jadwal Antar">
                    <p>
                        Pesanan dibagi ke dalam beberapa kloter waktu antar (Subuh Pagi, Menjelang Siang, Masak Sore)
                        dengan kuota terbatas per kloter. Pesanan yang sudah masuk kuota akan diproses dan diantar
                        sesuai jam kloter yang dipilih saat checkout. Kami berhak menutup kuota suatu kloter lebih
                        awal apabila pasokan sayur pada hari tersebut sudah habis.
                    </p>
                </Section>

                <Section no="3" title="Harga & Pembayaran">
                    <p>
                        Harga yang tertera di katalog adalah harga yang berlaku saat pesanan dibuat dan dapat berubah
                        sewaktu-waktu untuk pesanan berikutnya tanpa pemberitahuan sebelumnya. Kami menerima tiga
                        metode pembayaran: tunai di tempat (COD/titip pagar), QRIS, dan transfer Virtual Account bank.
                        Pembayaran QRIS dan Virtual Account diproses melalui mitra payment gateway pihak ketiga
                        (Midtrans) dan diverifikasi otomatis oleh sistem.
                    </p>
                </Section>

                <Section no="4" title="Pembatalan Pesanan">
                    <p>
                        Pesanan dengan metode QRIS/Virtual Account yang tidak diselesaikan pembayarannya dalam
                        waktu tertentu akan dibatalkan otomatis oleh sistem. Pembatalan oleh pelanggan setelah
                        pesanan diproses kurir dapat dikenakan kebijakan khusus yang akan diinformasikan melalui
                        WhatsApp admin.
                    </p>
                </Section>

                <Section no="5" title="Kualitas Produk & Retur">
                    <p>
                        Kami berusaha memastikan sayur yang diantar dalam kondisi segar. Apabila produk yang Anda
                        terima rusak, layu, atau tidak sesuai, Anda dapat mengajukan retur melalui halaman Riwayat
                        Pesanan selambat-lambatnya pada hari pesanan tersebut diterima, disertai foto kondisi produk.
                        Pengajuan retur akan ditinjau oleh tim kami dan keputusan (disetujui/ditolak) bersifat final.
                    </p>
                </Section>

                <Section no="6" title="Tanggung Jawab Pengguna">
                    <p>
                        Anda bertanggung jawab untuk memastikan alamat pengiriman, nomor telepon, dan catatan
                        patokan rumah yang Anda masukkan sudah benar. Kami tidak bertanggung jawab atas keterlambatan
                        atau kegagalan pengantaran yang disebabkan oleh kesalahan data yang Anda berikan.
                    </p>
                </Section>

                <Section no="7" title="Perubahan Ketentuan">
                    <p>
                        Kami dapat memperbarui syarat & ketentuan ini dari waktu ke waktu. Perubahan akan berlaku
                        sejak dipublikasikan di halaman ini. Penggunaan layanan secara berkelanjutan setelah
                        perubahan dianggap sebagai persetujuan terhadap ketentuan yang baru.
                    </p>
                </Section>

                <Section no="8" title="Kontak">
                    <p>
                        Pertanyaan terkait syarat & ketentuan ini dapat disampaikan melalui halaman Kontak atau
                        nomor WhatsApp admin yang tertera di footer situs.
                    </p>
                </Section>
            </div>
        </CustomerLayout>
    );
}
