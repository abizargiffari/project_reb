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

export default function Privacy() {
    return (
        <CustomerLayout>
            <Head title="Kebijakan Privasi" />
            <div className="mx-auto max-w-2xl px-4 py-10">
                <h1 className="text-2xl font-bold text-primary mb-1">Kebijakan Privasi</h1>
                <p className="text-xs text-text-secondary mb-8">Terakhir diperbarui: Oktober 2026</p>

                <Section no="1" title="Data yang Kami Kumpulkan">
                    <p>Untuk memproses pesanan Anda, kami mengumpulkan data berikut:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Nama, nomor telepon/WhatsApp, dan email saat Anda mendaftar akun.</li>
                        <li>Alamat lengkap dan catatan patokan rumah saat Anda melakukan checkout.</li>
                        <li>Riwayat pesanan, preferensi produk, dan metode pembayaran yang pernah digunakan.</li>
                    </ul>
                </Section>

                <Section no="2" title="Bagaimana Data Digunakan">
                    <p>Data yang kami kumpulkan digunakan semata-mata untuk:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Memproses dan mengantarkan pesanan Anda ke alamat yang benar.</li>
                        <li>Menghubungi Anda terkait status pesanan (konfirmasi, keterlambatan, retur).</li>
                        <li>Meningkatkan kualitas layanan, misalnya menampilkan ulasan yang Anda berikan.</li>
                    </ul>
                    <p>Kami tidak menjual atau menyewakan data pribadi Anda kepada pihak ketiga mana pun.</p>
                </Section>

                <Section no="3" title="Berbagi Data dengan Pihak Ketiga">
                    <p>
                        Data pembayaran (jumlah transaksi dan nomor pesanan) dibagikan kepada mitra payment
                        gateway kami, Midtrans, khusus untuk memproses pembayaran QRIS dan Virtual Account.
                        Kami tidak pernah membagikan kata sandi akun Anda kepada pihak mana pun, termasuk
                        Midtrans — proses pembayaran ditangani langsung oleh sistem Midtrans tanpa melalui
                        server kami.
                    </p>
                </Section>

                <Section no="4" title="Penyimpanan Data">
                    <p>
                        Data Anda disimpan selama akun Anda masih aktif, untuk keperluan riwayat pesanan dan
                        layanan purna jual (seperti pengajuan retur). Anda dapat meminta penghapusan akun dan
                        data pribadi Anda dengan menghubungi kami melalui halaman Kontak.
                    </p>
                </Section>

                <Section no="5" title="Keamanan Data">
                    <p>
                        Kata sandi akun Anda disimpan dalam bentuk terenkripsi (hashed), bukan teks biasa —
                        bahkan tim kami tidak dapat melihat kata sandi asli Anda. Kami menerapkan langkah
                        keamanan standar industri untuk melindungi data dari akses tidak sah.
                    </p>
                </Section>

                <Section no="6" title="Hak Anda">
                    <p>Anda berhak untuk:</p>
                    <ul className="list-disc pl-5 space-y-1">
                        <li>Mengakses dan memperbarui data pribadi Anda kapan saja lewat halaman Akun.</li>
                        <li>Meminta salinan data pribadi yang kami simpan tentang Anda.</li>
                        <li>Meminta penghapusan akun dan data pribadi Anda, sepanjang tidak melanggar
                            kewajiban hukum (misalnya catatan transaksi untuk keperluan pajak/akuntansi).</li>
                    </ul>
                </Section>

                <Section no="7" title="Perubahan Kebijakan">
                    <p>
                        Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu. Perubahan signifikan
                        akan diinformasikan melalui halaman ini.
                    </p>
                </Section>

                <Section no="8" title="Kontak">
                    <p>
                        Pertanyaan atau permintaan terkait data pribadi Anda dapat disampaikan melalui
                        halaman Kontak di situs ini.
                    </p>
                </Section>
            </div>
        </CustomerLayout>
    );
}
