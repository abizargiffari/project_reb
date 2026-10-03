import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function FormTambah({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({ nama: '', label: '', rating: 5, isi: '', catatan: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.testimonials.store'), { preserveScroll: true, onSuccess: onClose });
    }

    return (
        <form onSubmit={submit} className="bg-cream rounded-xl p-4 mb-4">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputClass} placeholder="Nama pelanggan" value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                <input className={inputClass} placeholder="Label (mis. Ibu RT 009)" value={data.label} onChange={(e) => setData('label', e.target.value)} />
            </div>
            {errors.nama && <p className="text-xs text-danger mb-2">{errors.nama}</p>}
            <div className="grid grid-cols-2 gap-3 mb-3">
                <select className={inputClass} value={data.rating} onChange={(e) => setData('rating', e.target.value)}>
                    {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Bintang</option>)}
                </select>
                <input className={inputClass} placeholder="Catatan (mis. Langganan sejak 2023)" value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} />
            </div>
            <textarea rows={2} className={inputClass + ' mb-3'} placeholder="Isi ulasan" value={data.isi} onChange={(e) => setData('isi', e.target.value)} />
            {errors.isi && <p className="text-xs text-danger mb-2">{errors.isi}</p>}
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Simpan</button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ testimonials, filters }) {
    const [tambah, setTambah] = useState(false);
    const { data, setData } = useForm({ status: filters.status ?? '' });

    function applyFilter(v) {
        setData('status', v);
        router.get(route('admin.testimonials.index'), { status: v }, { preserveState: true, replace: true });
    }

    function toggle(t) {
        router.patch(route('admin.testimonials.toggle', t.id), {}, { preserveScroll: true });
    }

    function hapus(t) {
        if (confirm(`Hapus testimoni dari "${t.nama}"?`)) router.delete(route('admin.testimonials.destroy', t.id), { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Testimoni" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Konten</p>
                    <h1 className="text-2xl font-bold text-primary">Testimoni Pelanggan</h1>
                    <p className="text-sm text-text-secondary">Ulasan dari pelanggan menunggu moderasi sebelum tampil di beranda.</p>
                </div>
                <button onClick={() => setTambah(!tambah)} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    {tambah ? 'Tutup' : '+ Tambah Manual'}
                </button>
            </div>

            {tambah && <FormTambah onClose={() => setTambah(false)} />}

            <div className="flex gap-2 mb-4">
                {[['', 'Semua'], ['menunggu', 'Menunggu Moderasi'], ['tampil', 'Tampil di Beranda']].map(([v, label]) => (
                    <button key={v} onClick={() => applyFilter(v)} className={`px-4 py-1.5 rounded-full text-sm font-medium ${data.status === v ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {testimonials.data.length === 0 && <p className="text-text-secondary text-sm">Tidak ada testimoni.</p>}
                {testimonials.data.map((t) => (
                    <div key={t.id} className="bg-white rounded-xl2 shadow-sm p-4">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-bold text-sm">{t.nama}</p>
                                <p className="text-xs text-text-secondary">{t.label}</p>
                            </div>
                            <Badge color={t.status_tampil ? 'success' : 'orange'}>{t.status_tampil ? 'Tampil' : 'Menunggu'}</Badge>
                        </div>
                        <p className="text-yellow-500 text-sm my-1">{'★'.repeat(t.rating)}</p>
                        <p className="text-sm text-gray-600">{t.isi}</p>
                        <div className="flex gap-3 mt-3">
                            <button onClick={() => toggle(t)} className="text-primary text-xs font-semibold">
                                {t.status_tampil ? 'Sembunyikan' : 'Tampilkan'}
                            </button>
                            <button onClick={() => hapus(t)} className="text-danger text-xs font-semibold">Hapus</button>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
