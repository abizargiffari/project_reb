import CheckoutLayout from '@/Layouts/CheckoutLayout';
import Badge from '@/Components/UI/Badge';
import SelectionCard from '@/Components/UI/SelectionCard';
import { jam, rupiah } from '@/Utils/format';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const inputClass =
    'w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-primary focus:outline-none';

// Didefinisikan DI LUAR komponen utama: kalau di dalam, React menganggapnya komponen baru
// setiap render dan input kehilangan fokus tiap kali mengetik.
function Field({ label, required, optional, error, children }) {
    return (
        <div className="mb-4">
            <div className="mb-1.5 flex items-center justify-between">
                <label className="text-xs font-semibold">
                    {label} {required && <span className="text-danger">*</span>}
                </label>
                {optional && <span className="text-xs text-text-secondary">Opsional</span>}
            </div>
            {children}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
}

function SectionCard({ no, title, subtitle, right, children }) {
    return (
        <section className="rounded-xl2 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">{no}</div>
                    <div>
                        <h2 className="font-bold text-primary">{title}</h2>
                        <p className="text-xs text-text-secondary">{subtitle}</p>
                    </div>
                </div>
                {right}
            </div>
            {children}
        </section>
    );
}

export default function Index({ items, summary, voucher, voucherError, batches, prefill }) {
    const { data, setData, post, processing, errors } = useForm({
        nama_penerima: prefill.nama_penerima ?? '',
        telepon_penerima: prefill.telepon_penerima ?? '',
        alamat_lengkap: prefill.alamat_lengkap ?? '',
        catatan_patokan: prefill.catatan_patokan ?? '',
        simpan_alamat: false,
        delivery_batch_id: '',
        metode_bayar: 'cod',
        cod_nominal_disiapkan: '',
        voucher_kode: voucher?.kode ?? '',
    });

    const [kodeInput, setKodeInput] = useState(voucher?.kode ?? '');

    // Sinkronkan kode voucher yang SUDAH tervalidasi server ke data form.
    useEffect(() => {
        setData('voucher_kode', voucher?.kode ?? '');
    }, [voucher?.kode]);

    function pasangVoucher() {
        router.get(
            route('checkout.index'),
            { voucher: kodeInput.trim() },
            { preserveState: true, preserveScroll: true, replace: true, only: ['summary', 'voucher', 'voucherError'] }
        );
    }

    function submit(e) {
        e.preventDefault();
        post(route('checkout.store'));
    }

    const gratisOngkir = summary.ongkir === 0 && summary.ongkir_asli > 0;

    return (
        <CheckoutLayout>
            <Head title="Checkout & Pembayaran" />

            <form onSubmit={submit} className="mx-auto max-w-6xl px-4 py-8">
                <div className="mb-6 mt-1 flex flex-wrap items-center justify-between gap-2">
                    <h1 className="text-2xl font-bold text-primary">Checkout Pesanan Sayur</h1>
                </div>

                {errors.cart && (
                    <div className="mb-4 rounded-xl bg-danger-light px-4 py-3 text-sm font-medium text-danger">{errors.cart}</div>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        {/* 1. Data penerima */}
                        <SectionCard no="1" title="Data Penerima & Titik Antar" subtitle="Ke mana sayur segar kami antarkan?">
                            <div className="grid gap-x-4 sm:grid-cols-2">
                                <Field label="Nama Lengkap Penerima" required error={errors.nama_penerima}>
                                    <input className={inputClass} value={data.nama_penerima} onChange={(e) => setData('nama_penerima', e.target.value)} />
                                </Field>
                                <Field label="Nomor Telepon/WhatsApp" required error={errors.telepon_penerima}>
                                    <input className={inputClass} inputMode="tel" placeholder="081234567890" value={data.telepon_penerima} onChange={(e) => setData('telepon_penerima', e.target.value)} />
                                </Field>
                            </div>
                            <Field label="Alamat Lengkap Pengiriman" required error={errors.alamat_lengkap}>
                                <input className={inputClass} placeholder="Jalan, nomor rumah, RT/RW" value={data.alamat_lengkap} onChange={(e) => setData('alamat_lengkap', e.target.value)} />
                            </Field>
                            <Field label="Catatan Patokan Rumah & Titik Taruh Sayur" optional error={errors.catatan_patokan}>
                                <input className={inputClass} placeholder="Contoh: pagar hijau, gantung di gerbang" value={data.catatan_patokan} onChange={(e) => setData('catatan_patokan', e.target.value)} />
                            </Field>
                            <label className="flex items-center gap-2 text-sm text-text-secondary">
                                <input type="checkbox" checked={data.simpan_alamat} onChange={(e) => setData('simpan_alamat', e.target.checked)} />
                                Simpan sebagai alamat langganan utama warga Ciganjur
                            </label>
                        </SectionCard>

                        {/* 2. Kloter */}
                        <SectionCard
                            no="2"
                            title="Pilih Jam Antar Kurir"
                            subtitle="Jadwal pengantaran hari ini"
                            right={<Badge color="success"> Antar Segar Berpendingin</Badge>}
                        >
                            <div className="mb-4 flex items-start gap-3 rounded-xl bg-cream p-3">
                                <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">🛵</div>
                                <div>
                                    <p className="text-sm font-bold">Diantar oleh Mas Yahya — Kurir Tetangga Ciganjur</p>
                                    <p className="text-xs text-text-secondary">Sayur diantar rapi ke depan rumah, aman dan tepat waktu.</p>
                                </div>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-3" role="radiogroup" aria-label="Pilih jam antar">
                                {batches.map((b) => {
                                    const penuh = b.sisa_slot <= 0;
                                    return (
                                        <SelectionCard
                                            key={b.id}
                                            selected={Number(data.delivery_batch_id) === b.id}
                                            disabled={penuh}
                                            onSelect={() => setData('delivery_batch_id', b.id)}
                                        >
                                            {b.badge_status && (
                                                <Badge color={Number(data.delivery_batch_id) === b.id ? 'primary' : 'neutral'} className="mb-2">
                                                    {b.badge_status}
                                                </Badge>
                                            )}
                                            <p className="font-bold">{b.nama_kloter}</p>
                                            <p className="text-sm text-text-secondary">{jam(b.jam_mulai)} – {jam(b.jam_selesai)} WIB</p>
                                            <p className={`mt-2 text-xs font-semibold ${penuh ? 'text-danger' : b.sisa_slot <= 5 ? 'text-accent-orange' : 'text-text-secondary'}`}>
                                                {penuh ? 'Kuota penuh' : b.sisa_slot <= 5 ? `Sisa ${b.sisa_slot} slot` : `Tersedia ${b.sisa_slot} slot`}
                                            </p>
                                        </SelectionCard>
                                    );
                                })}
                            </div>
                            {errors.delivery_batch_id && <p className="mt-2 text-xs text-danger">{errors.delivery_batch_id}</p>}
                        </SectionCard>

                        {/* 3. Metode bayar */}
                        <SectionCard no="3" title="Metode Pembayaran" subtitle="Pilih cara bayar yang paling nyaman">
                            <div className="space-y-3" role="radiogroup" aria-label="Metode pembayaran">
                                <SelectionCard selected={data.metode_bayar === 'cod'} onSelect={() => setData('metode_bayar', 'cod')}>
                                    <div className="flex items-center gap-2 pr-8">
                                        <p className="font-bold">Bayar di Tempat (COD Titip Pagar/Tunai)</p>
                                        <Badge color="orange">FAVORIT WARGA</Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-text-secondary">Bayar tunai ke Mas Yahya saat sayur tiba. Tanpa biaya tambahan.</p>

                                    {data.metode_bayar === 'cod' && (
                                        <div className="mt-4 border-t border-gray-100 pt-4" onClick={(e) => e.stopPropagation()}>
                                            <label className="text-xs font-semibold">Nominal Uang yang Disiapkan (untuk kembalian)</label>
                                            <input
                                                type="number"
                                                min="0"
                                                className={`${inputClass} mt-1.5`}
                                                placeholder="Kosongkan bila uang pas"
                                                value={data.cod_nominal_disiapkan}
                                                onChange={(e) => setData('cod_nominal_disiapkan', e.target.value)}
                                            />
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {[
                                                    { label: 'Uang Pas', value: summary.total },
                                                    { label: 'Rp50.000', value: 50000 },
                                                    { label: 'Rp100.000', value: 100000 },
                                                ].map((q) => (
                                                    <button
                                                        key={q.label}
                                                        type="button"
                                                        disabled={q.value < summary.total}
                                                        onClick={() => setData('cod_nominal_disiapkan', q.value)}
                                                        className="rounded-full border border-primary px-3 py-1 text-xs font-semibold text-primary hover:bg-primary hover:text-white disabled:cursor-not-allowed disabled:border-gray-200 disabled:text-gray-300 disabled:hover:bg-transparent"
                                                    >
                                                        {q.label}
                                                    </button>
                                                ))}
                                            </div>
                                            {errors.cod_nominal_disiapkan && <p className="mt-1 text-xs text-danger">{errors.cod_nominal_disiapkan}</p>}
                                        </div>
                                    )}
                                </SelectionCard>

                                <SelectionCard selected={data.metode_bayar === 'qris'} onSelect={() => setData('metode_bayar', 'qris')}>
                                    <div className="flex items-center gap-2 pr-8">
                                        <p className="font-bold">QRIS Dinamis (Verifikasi Otomatis)</p>
                                        <Badge color="success">BEBAS ADMIN</Badge>
                                    </div>
                                    <p className="mt-1 text-xs text-text-secondary">Scan dengan GoPay, OVO, ShopeePay, atau m-banking. Pesanan otomatis terkonfirmasi setelah bayar.</p>
                                </SelectionCard>

                                <SelectionCard selected={data.metode_bayar === 'va'} onSelect={() => setData('metode_bayar', 'va')}>
                                    <p className="pr-8 font-bold">Virtual Account (VA Bank Otomatis)</p>
                                    <p className="mt-1 text-xs text-text-secondary">Transfer ke nomor VA bank pilihan. Terverifikasi otomatis tanpa konfirmasi manual.</p>
                                </SelectionCard>
                            </div>
                            {errors.metode_bayar && <p className="mt-2 text-xs text-danger">{errors.metode_bayar}</p>}
                        </SectionCard>
                    </div>

                    {/* Ringkasan */}
                    <aside className="h-fit space-y-4 lg:sticky lg:top-6">
                        <div className="rounded-xl2 bg-white p-5 shadow-sm">
                            <div className="mb-3 flex items-center justify-between">
                                <p className="font-bold text-primary">Ringkasan Belanja ({items.length} Item)</p>
                                <Link href={route('cart.index')} className="text-xs font-semibold text-primary hover:underline">Ubah</Link>
                            </div>

                            <ul className="space-y-3">
                                {items.map((i) => (
                                    <li key={i.id} className="flex items-center gap-3">
                                        <div className="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg bg-cream">
                                            {i.gambar && <img src={`/storage/${i.gambar}`} alt="" className="h-full w-full object-cover" />}
                                        </div>
                                        <div className="min-w-0 flex-1">
                                            <p className="truncate text-sm font-semibold">{i.nama}</p>
                                            <p className="text-xs text-text-secondary">{i.qty} × {rupiah(i.harga_jual)}</p>
                                        </div>
                                        <p className="text-sm font-bold">{rupiah(i.subtotal)}</p>
                                    </li>
                                ))}
                            </ul>

                            {/* Voucher */}
                            <div className="mt-4 border-t border-gray-100 pt-4">
                                {voucher ? (
                                    <div className="flex items-center justify-between rounded-lg bg-success-light px-3 py-2">
                                        <span className="text-sm font-semibold text-success">🏷 {voucher.kode}</span>
                                        <Badge color="success">TERPASANG</Badge>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            className={inputClass}
                                            placeholder="Kode voucher"
                                            value={kodeInput}
                                            onChange={(e) => setKodeInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); pasangVoucher(); } }}
                                        />
                                        <button type="button" onClick={pasangVoucher} disabled={!kodeInput.trim()} className="rounded-lg border border-primary px-4 text-sm font-semibold text-primary disabled:opacity-40">
                                            Pasang
                                        </button>
                                    </div>
                                )}
                                {voucherError && <p className="mt-1.5 text-xs text-danger">{voucherError}</p>}
                                {errors.voucher_kode && <p className="mt-1.5 text-xs text-danger">{errors.voucher_kode}</p>}
                            </div>

                            <div className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                                <div className="flex justify-between"><span className="text-text-secondary">Subtotal Produk</span><span className="font-semibold">{rupiah(summary.subtotal)}</span></div>
                                <div className="flex justify-between">
                                    <span className="text-text-secondary">Ongkir</span>
                                    <span className="font-semibold">
                                        {gratisOngkir ? (
                                            <><span className="mr-1 text-gray-400 line-through">{rupiah(summary.ongkir_asli)}</span><span className="font-bold text-success">GRATIS</span></>
                                        ) : rupiah(summary.ongkir)}
                                    </span>
                                </div>
                                <div className="flex justify-between"><span className="text-text-secondary">Biaya Penanganan & Kantong Bio</span><span className="font-semibold">{rupiah(summary.biaya_kantong)}</span></div>
                                {summary.potongan_voucher > 0 && (
                                    <div className="flex justify-between text-success"><span>Potongan Voucher</span><span className="font-semibold">− {rupiah(summary.potongan_voucher)}</span></div>
                                )}
                            </div>

                            <div className="mt-4 border-t border-gray-100 pt-4">
                                <div className="flex items-end justify-between">
                                    <span className="font-bold">Total Tagihan</span>
                                    <span className="text-2xl font-bold text-primary">{rupiah(summary.total)}</span>
                                </div>
                                <p className="mt-1 text-right text-xs text-text-secondary">Termasuk kantong ramah lingkungan</p>
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="mt-5 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-60"
                            >
                                {processing ? 'Memproses...' : `🔒 Konfirmasi & Bayar Pesanan (${rupiah(summary.total)})`}
                            </button>
                            <p className="mt-2 text-center text-[11px] text-text-secondary">
                                Dengan menekan tombol ini, kamu menyetujui jadwal antar yang dipilih.
                            </p>
                        </div>

                        <div className="rounded-xl2 bg-white p-4 text-sm shadow-sm">
                            <p className="font-bold">Garansi Sayur Segar 100%</p>
                            <p className="text-xs text-text-secondary">Sayur layu atau busuk? Diganti baru langsung di pagar.</p>
                            <p className="mt-3 font-bold">Timbangan Digital Jujur & Amanah</p>
                            <p className="text-xs text-text-secondary">Berat sesuai timbangan, tidak dikurangi.</p>
                        </div>
                    </aside>
                </div>
            </form>
        </CheckoutLayout>
    );
}
