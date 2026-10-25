import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = 'w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none';

// Di luar komponen utama supaya input tidak kehilangan fokus tiap ketikan.
function Field({ label, error, children }) {
    return (
        <div className="mb-3">
            <label className="mb-1 block text-xs font-semibold">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
}

function FormAlamat({ alamat, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        label: alamat?.label ?? 'Rumah',
        nama_penerima: alamat?.nama_penerima ?? '',
        telepon_penerima: alamat?.telepon_penerima ?? '',
        alamat_lengkap: alamat?.alamat_lengkap ?? '',
        catatan_patokan: alamat?.catatan_patokan ?? '',
        is_default: alamat?.is_default ?? false,
    });

    function submit(e) {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (alamat) patch(route('account.addresses.update', alamat.id), opts);
        else post(route('account.addresses.store'), opts);
    }

    return (
        <form onSubmit={submit} className="mt-3 rounded-xl bg-cream p-4">
            <div className="grid gap-x-3 sm:grid-cols-2">
                <Field label="Label (mis. Rumah, Kantor)" error={errors.label}>
                    <input className={inputClass} value={data.label} onChange={(e) => setData('label', e.target.value)} />
                </Field>
                <Field label="Nama Penerima" error={errors.nama_penerima}>
                    <input className={inputClass} value={data.nama_penerima} onChange={(e) => setData('nama_penerima', e.target.value)} />
                </Field>
            </div>
            <Field label="Nomor Telepon/WhatsApp" error={errors.telepon_penerima}>
                <input className={inputClass} inputMode="tel" placeholder="081234567890" value={data.telepon_penerima} onChange={(e) => setData('telepon_penerima', e.target.value)} />
            </Field>
            <Field label="Alamat Lengkap" error={errors.alamat_lengkap}>
                <textarea rows={2} className={inputClass} value={data.alamat_lengkap} onChange={(e) => setData('alamat_lengkap', e.target.value)} />
            </Field>
            <Field label="Catatan Patokan Rumah (opsional)" error={errors.catatan_patokan}>
                <input className={inputClass} placeholder="Pagar hijau, gantung di gerbang" value={data.catatan_patokan} onChange={(e) => setData('catatan_patokan', e.target.value)} />
            </Field>

            {!alamat?.is_default && (
                <label className="mb-3 flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={data.is_default} onChange={(e) => setData('is_default', e.target.checked)} />
                    Jadikan alamat utama
                </label>
            )}

            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Addresses({ addresses }) {
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(null);

    function jadikanUtama(a) {
        router.patch(route('account.addresses.default', a.id), {}, { preserveScroll: true });
    }

    function hapus(a) {
        if (confirm(`Hapus alamat "${a.label}"?`)) {
            router.delete(route('account.addresses.destroy', a.id), { preserveScroll: true });
        }
    }

    return (
        <CustomerLayout>
            <Head title="Alamat Pengiriman" />

            <div className="mx-auto max-w-2xl px-4 py-8">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">Alamat Pengiriman</h1>
                        <p className="text-sm text-text-secondary">Alamat utama otomatis terisi saat checkout.</p>
                    </div>
                    <button onClick={() => { setTambah(!tambah); setEdit(null); }} className="whitespace-nowrap rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
                        {tambah ? 'Tutup' : '+ Tambah Alamat'}
                    </button>
                </div>

                {tambah && (
                    <div className="mb-4 rounded-xl2 bg-white p-4 shadow-sm">
                        <p className="font-bold text-primary">Alamat Baru</p>
                        <FormAlamat onClose={() => setTambah(false)} />
                    </div>
                )}

                {addresses.length === 0 && !tambah && (
                    <div className="rounded-xl2 bg-white p-10 text-center shadow-sm">
                        <p className="text-text-secondary">Belum ada alamat tersimpan. Alamat juga otomatis tersimpan saat Anda checkout.</p>
                    </div>
                )}

                <div className="space-y-3">
                    {addresses.map((a) => (
                        <div key={a.id} className="rounded-xl2 bg-white p-4 shadow-sm">
                            {edit === a.id ? (
                                <FormAlamat alamat={a} onClose={() => setEdit(null)} />
                            ) : (
                                <>
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="font-bold">{a.label} {a.is_default && <Badge color="success" className="ml-1">UTAMA</Badge>}</p>
                                    </div>
                                    <p className="mt-1 text-sm font-semibold">{a.nama_penerima} <span className="font-normal text-text-secondary">• {a.telepon_penerima}</span></p>
                                    <p className="text-sm text-gray-600">{a.alamat_lengkap}</p>
                                    {a.catatan_patokan && <p className="mt-1 text-xs text-accent-orange">📍 {a.catatan_patokan}</p>}

                                    <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                                        <button onClick={() => { setEdit(a.id); setTambah(false); }} className="text-primary">Ubah</button>
                                        {!a.is_default && <button onClick={() => jadikanUtama(a)} className="text-primary">Jadikan Utama</button>}
                                        {a.orders_count === 0 && <button onClick={() => hapus(a)} className="text-danger">Hapus</button>}
                                    </div>
                                    {a.orders_count > 0 && (
                                        <p className="mt-2 text-xs text-text-secondary">Dipakai pada {a.orders_count} pesanan, jadi tidak bisa dihapus.</p>
                                    )}
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
