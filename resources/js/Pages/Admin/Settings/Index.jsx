import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { jam } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const TABS = [
    { key: 'profil', label: 'Profil Toko' },
    { key: 'pengiriman', label: 'Pengiriman & Biaya' },
    { key: 'pembayaran', label: 'Pembayaran' },
    { key: 'kloter', label: 'Jadwal Kloter' },
];

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Field({ label, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5">{label}</label>
            {children}
        </div>
    );
}

function FormKloter({ batch, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        nama_kloter: batch?.nama_kloter ?? '',
        jam_mulai: batch?.jam_mulai?.slice(0, 5) ?? '',
        jam_selesai: batch?.jam_selesai?.slice(0, 5) ?? '',
        kuota: batch?.kuota ?? 20,
        badge_status: batch?.badge_status ?? '',
        status_aktif: batch?.status_aktif ?? true,
    });

    function submit(e) {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (batch) patch(route('admin.settings.kloter.update', batch.id), opts);
        else post(route('admin.settings.kloter.store'), opts);
    }

    return (
        <form onSubmit={submit} className="bg-cream rounded-xl p-4 mt-3">
            <div className="grid grid-cols-2 gap-3">
                <Field label="Nama Kloter"><input className={inputClass} value={data.nama_kloter} onChange={(e) => setData('nama_kloter', e.target.value)} /></Field>
                <Field label="Badge (opsional)"><input className={inputClass} placeholder="TERLARIS" value={data.badge_status} onChange={(e) => setData('badge_status', e.target.value)} /></Field>
                <Field label="Jam Mulai"><input type="time" className={inputClass} value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} /></Field>
                <Field label="Jam Selesai"><input type="time" className={inputClass} value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} /></Field>
                <Field label="Kuota Pesanan">
                    <input type="number" className={inputClass} value={data.kuota} onChange={(e) => setData('kuota', e.target.value)} />
                    {errors.kuota && <p className="text-xs text-danger mt-1">{errors.kuota}</p>}
                </Field>
                {batch && (
                    <div className="flex items-end pb-2">
                        <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" checked={data.status_aktif} onChange={(e) => setData('status_aktif', e.target.checked)} />
                            Kloter aktif
                        </label>
                    </div>
                )}
            </div>
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50">Simpan</button>
                <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ settings, batches }) {
    const [tab, setTab] = useState('profil');
    const [editBatch, setEditBatch] = useState(null);
    const [tambahBatch, setTambahBatch] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({ ...settings });

    function submit(e) {
        e.preventDefault();
        patch(route('admin.settings.update'), { preserveScroll: true });
    }

    function hapusBatch(b) {
        if (confirm(`Hapus kloter "${b.nama_kloter}"? Hanya bisa kalau belum pernah ada pesanan.`)) {
            router.delete(route('admin.settings.kloter.destroy', b.id), { preserveScroll: true });
        }
    }

    return (
        <AdminLayout>
            <Head title="Pengaturan Lapak" />

            <div className="mb-6">
                <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Operasional</p>
                <h1 className="text-2xl font-bold text-primary">Pengaturan Lapak</h1>
            </div>

            <div className="flex gap-2 mb-4 overflow-x-auto">
                {TABS.map((t) => (
                    <button key={t.key} onClick={() => setTab(t.key)}
                        className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap ${tab === t.key ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                        {t.label}
                    </button>
                ))}
            </div>

            {tab !== 'kloter' ? (
                <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-2xl">
                    {tab === 'profil' && (
                        <>
                            <Field label="Nama Toko"><input className={inputClass} value={data.store_name} onChange={(e) => setData('store_name', e.target.value)} /></Field>
                            <Field label="Tagline"><input className={inputClass} value={data.store_tagline} onChange={(e) => setData('store_tagline', e.target.value)} /></Field>
                            <Field label="Alamat"><textarea rows={2} className={inputClass} value={data.store_address} onChange={(e) => setData('store_address', e.target.value)} /></Field>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Telepon"><input className={inputClass} value={data.store_phone} onChange={(e) => setData('store_phone', e.target.value)} /></Field>
                                <Field label="Jam Operasional"><input className={inputClass} placeholder="05:00 - 18:00 WIB" value={data.store_open_hours} onChange={(e) => setData('store_open_hours', e.target.value)} /></Field>
                            </div>
                        </>
                    )}

                    {tab === 'pengiriman' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Ongkir Flat (Rp)"><input type="number" className={inputClass} value={data.ongkir_flat} onChange={(e) => setData('ongkir_flat', e.target.value)} /></Field>
                                <Field label="Minimal Gratis Ongkir (Rp)"><input type="number" className={inputClass} value={data.gratis_ongkir_minimal} onChange={(e) => setData('gratis_ongkir_minimal', e.target.value)} /></Field>
                                <Field label="Biaya Kantong Bio (Rp)"><input type="number" className={inputClass} value={data.biaya_kantong} onChange={(e) => setData('biaya_kantong', e.target.value)} /></Field>
                            </div>
                            <Field label="Area Layanan"><input className={inputClass} placeholder="Ciganjur, Jagakarsa, Cipedak, Lenteng Agung" value={data.area_layanan} onChange={(e) => setData('area_layanan', e.target.value)} /></Field>
                            <p className="text-xs text-text-secondary -mt-2">Perubahan di sini langsung memengaruhi perhitungan checkout pelanggan.</p>
                        </>
                    )}

                    {tab === 'pembayaran' && (
                        <>
                            <div className="grid grid-cols-2 gap-3">
                                <Field label="Nama Bank"><input className={inputClass} value={data.payment_bank_name} onChange={(e) => setData('payment_bank_name', e.target.value)} /></Field>
                                <Field label="Nomor Rekening"><input className={inputClass} value={data.payment_bank_number} onChange={(e) => setData('payment_bank_number', e.target.value)} /></Field>
                            </div>
                            <Field label="Atas Nama"><input className={inputClass} value={data.payment_bank_holder} onChange={(e) => setData('payment_bank_holder', e.target.value)} /></Field>
                            <Field label="Status QRIS"><input className={inputClass} placeholder="connected / belum aktif" value={data.payment_qris_status} onChange={(e) => setData('payment_qris_status', e.target.value)} /></Field>
                            <p className="text-xs text-text-secondary -mt-2">
                                Nilai di sini sebagai catatan tampilan saja — kunci asli Midtrans tetap diatur lewat file <code>.env</code> server, bukan dari sini.
                            </p>
                        </>
                    )}

                    <button type="submit" disabled={processing} className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                        {processing ? 'Menyimpan...' : 'Simpan Pengaturan'}
                    </button>
                </form>
            ) : (
                <div className="bg-white rounded-xl2 shadow-sm p-6 max-w-2xl">
                    <div className="flex items-center justify-between mb-3">
                        <p className="font-bold text-primary">Jadwal Kloter</p>
                        <button onClick={() => { setTambahBatch(!tambahBatch); setEditBatch(null); }} className="text-sm font-semibold text-primary">
                            {tambahBatch ? 'Tutup' : '+ Tambah Kloter'}
                        </button>
                    </div>

                    {tambahBatch && <FormKloter onClose={() => setTambahBatch(false)} />}

                    <div className="divide-y divide-gray-100 mt-3">
                        {batches.map((b) => (
                            <div key={b.id} className="py-3">
                                {editBatch === b.id ? (
                                    <FormKloter batch={b} onClose={() => setEditBatch(null)} />
                                ) : (
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-sm">{b.nama_kloter} {b.badge_status && <Badge color="orange" className="ml-1">{b.badge_status}</Badge>} {!b.status_aktif && <Badge color="neutral" className="ml-1">Nonaktif</Badge>}</p>
                                            <p className="text-xs text-text-secondary">{jam(b.jam_mulai)}–{jam(b.jam_selesai)} WIB • Kuota {b.kuota} (terpakai {b.terpakai})</p>
                                        </div>
                                        <div className="flex gap-3">
                                            <button onClick={() => setEditBatch(b.id)} className="text-primary text-sm font-semibold">Edit</button>
                                            <button onClick={() => hapusBatch(b)} className="text-danger text-sm font-semibold">Hapus</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
