import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { rupiah } from '@/Utils/format';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Field({ label, error, children }) {
    return (
        <div className="mb-3">
            <label className="mb-1 block text-xs font-semibold">{label}</label>
            {children}
            {error && <p className="mt-1 text-xs text-danger">{error}</p>}
        </div>
    );
}

function FormVoucher({ voucher, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        kode: voucher?.kode ?? '',
        tipe: voucher?.tipe ?? 'nominal',
        nilai: voucher?.nilai ? Number(voucher.nilai) : '',
        minimal_belanja: voucher?.minimal_belanja ? Number(voucher.minimal_belanja) : '',
        kuota: voucher?.kuota ?? '',
        berlaku_dari: voucher?.berlaku_dari?.slice(0, 10) ?? '',
        berlaku_sampai: voucher?.berlaku_sampai?.slice(0, 10) ?? '',
        status_aktif: voucher?.status_aktif ?? true,
    });

    function submit(e) {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        if (voucher) patch(route('admin.vouchers.update', voucher.id), opts);
        else post(route('admin.vouchers.store'), opts);
    }

    return (
        <form onSubmit={submit} className="mb-4 rounded-xl bg-cream p-4">
            <div className="grid gap-x-3 sm:grid-cols-3">
                <Field label="Kode Voucher" error={errors.kode}>
                    <input className={inputClass + ' uppercase'} placeholder="HEMAT5" value={data.kode} onChange={(e) => setData('kode', e.target.value)} />
                </Field>
                <Field label="Jenis Potongan" error={errors.tipe}>
                    <select className={inputClass} value={data.tipe} onChange={(e) => setData('tipe', e.target.value)}>
                        <option value="nominal">Nominal (Rp)</option>
                        <option value="persen">Persen (%)</option>
                    </select>
                </Field>
                <Field label={data.tipe === 'persen' ? 'Besar Potongan (%)' : 'Besar Potongan (Rp)'} error={errors.nilai}>
                    <input type="number" min="1" className={inputClass} value={data.nilai} onChange={(e) => setData('nilai', e.target.value)} />
                </Field>
                <Field label="Minimal Belanja (Rp, opsional)" error={errors.minimal_belanja}>
                    <input type="number" min="0" className={inputClass} value={data.minimal_belanja} onChange={(e) => setData('minimal_belanja', e.target.value)} />
                </Field>
                <Field label="Kuota Pemakaian (opsional)" error={errors.kuota}>
                    <input type="number" min="1" className={inputClass} placeholder="kosong = tak terbatas" value={data.kuota} onChange={(e) => setData('kuota', e.target.value)} />
                </Field>
                <div />
                <Field label="Berlaku Dari (opsional)" error={errors.berlaku_dari}>
                    <input type="date" className={inputClass} value={data.berlaku_dari} onChange={(e) => setData('berlaku_dari', e.target.value)} />
                </Field>
                <Field label="Berlaku Sampai (opsional)" error={errors.berlaku_sampai}>
                    <input type="date" className={inputClass} value={data.berlaku_sampai} onChange={(e) => setData('berlaku_sampai', e.target.value)} />
                </Field>
            </div>
            <label className="mb-3 flex items-center gap-2 text-sm">
                <input type="checkbox" checked={data.status_aktif} onChange={(e) => setData('status_aktif', e.target.checked)} />
                Voucher aktif
            </label>
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Simpan</button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ vouchers }) {
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(null);

    function hapus(v) {
        if (confirm(`Hapus voucher "${v.kode}"?`)) router.delete(route('admin.vouchers.destroy', v.id), { preserveScroll: true });
    }

    const labelPotongan = (v) => (v.tipe === 'persen' ? `${Number(v.nilai)}%` : rupiah(v.nilai));

    return (
        <AdminLayout>
            <Head title="Voucher" />

            <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">Modul Katalog</p>
                    <h1 className="text-2xl font-bold text-primary">Voucher & Diskon</h1>
                    <p className="text-sm text-text-secondary">Kode voucher yang bisa dimasukkan pelanggan saat checkout.</p>
                </div>
                <button onClick={() => { setTambah(!tambah); setEdit(null); }} className="whitespace-nowrap rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">
                    {tambah ? 'Tutup' : '+ Buat Voucher'}
                </button>
            </div>

            {tambah && <FormVoucher onClose={() => setTambah(false)} />}

            <div className="space-y-3">
                {vouchers.length === 0 && <p className="text-sm text-text-secondary">Belum ada voucher.</p>}
                {vouchers.map((v) => (
                    <div key={v.id} className="rounded-xl2 bg-white p-4 shadow-sm">
                        {edit === v.id ? (
                            <FormVoucher voucher={v} onClose={() => setEdit(null)} />
                        ) : (
                            <div className="flex flex-wrap items-start justify-between gap-3">
                                <div>
                                    <p className="font-bold">
                                        <span className="font-mono">{v.kode}</span>{' '}
                                        <Badge color={v.status_aktif ? 'success' : 'neutral'} className="ml-1">{v.status_aktif ? 'Aktif' : 'Nonaktif'}</Badge>
                                    </p>
                                    <p className="mt-1 text-sm text-gray-600">
                                        Potongan <strong>{labelPotongan(v)}</strong>
                                        {v.minimal_belanja && Number(v.minimal_belanja) > 0 && <> • min. belanja {rupiah(v.minimal_belanja)}</>}
                                    </p>
                                    <p className="text-xs text-text-secondary">
                                        Terpakai {v.terpakai}{v.kuota ? ` dari ${v.kuota}` : ' (tanpa batas kuota)'}
                                        {(v.berlaku_dari || v.berlaku_sampai) && <> • {v.berlaku_dari?.slice(0, 10) ?? '…'} s/d {v.berlaku_sampai?.slice(0, 10) ?? '…'}</>}
                                    </p>
                                </div>
                                <div className="flex gap-3 text-sm font-semibold">
                                    <button onClick={() => { setEdit(v.id); setTambah(false); }} className="text-primary">Edit</button>
                                    <button onClick={() => hapus(v)} className="text-danger">Hapus</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
