import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function FormBanner({ onClose }) {
    const { data, setData, post, processing, errors } = useForm({ judul: '', gambar: null, link: '', tanggal_mulai: '', tanggal_selesai: '' });

    function submit(e) {
        e.preventDefault();
        post(route('admin.banners.store'), { forceFormData: true, preserveScroll: true, onSuccess: onClose });
    }

    return (
        <form onSubmit={submit} className="bg-cream rounded-xl p-4 mb-4">
            <input className={inputClass + ' mb-3'} placeholder="Judul banner" value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
            {errors.judul && <p className="text-xs text-danger mb-2">{errors.judul}</p>}
            <input className={inputClass + ' mb-3'} placeholder="Link tujuan (opsional, mis. /katalog)" value={data.link} onChange={(e) => setData('link', e.target.value)} />
            <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                    <label className="text-xs text-text-secondary">Tayang Dari</label>
                    <input type="date" className={inputClass} value={data.tanggal_mulai} onChange={(e) => setData('tanggal_mulai', e.target.value)} />
                </div>
                <div>
                    <label className="text-xs text-text-secondary">Sampai</label>
                    <input type="date" className={inputClass} value={data.tanggal_selesai} onChange={(e) => setData('tanggal_selesai', e.target.value)} />
                </div>
            </div>
            <input type="file" accept="image/*" onChange={(e) => setData('gambar', e.target.files[0])} className="mb-3" />
            {errors.gambar && <p className="text-xs text-danger mb-2">{errors.gambar}</p>}
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Simpan</button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ banners }) {
    const [tambah, setTambah] = useState(false);

    function toggle(b) {
        router.patch(route('admin.banners.update', b.id), { judul: b.judul, link: b.link, status_aktif: !b.status_aktif }, { preserveScroll: true });
    }

    function hapus(b) {
        if (confirm(`Hapus banner "${b.judul}"?`)) router.delete(route('admin.banners.destroy', b.id), { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Banner Promosi" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Konten</p>
                    <h1 className="text-2xl font-bold text-primary">Banner Promosi</h1>
                    <p className="text-sm text-text-secondary">Banner pertama yang aktif tampil sebagai hero di beranda.</p>
                </div>
                <button onClick={() => setTambah(!tambah)} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    {tambah ? 'Tutup' : '+ Tambah Banner'}
                </button>
            </div>

            {tambah && <FormBanner onClose={() => setTambah(false)} />}

            <div className="grid md:grid-cols-3 gap-4">
                {banners.map((b) => (
                    <div key={b.id} className="bg-white rounded-xl2 shadow-sm overflow-hidden">
                        <div className="aspect-video bg-cream">
                            {b.gambar && <img src={`/storage/${b.gambar}`} alt={b.judul} className="w-full h-full object-cover" />}
                        </div>
                        <div className="p-3">
                            <div className="flex items-center justify-between mb-1">
                                <p className="font-semibold text-sm">{b.judul}</p>
                                <Badge color={b.status_aktif ? 'success' : 'neutral'}>{b.status_aktif ? 'Aktif' : 'Nonaktif'}</Badge>
                            </div>
                            <div className="flex gap-3 mt-2">
                                <button onClick={() => toggle(b)} className="text-primary text-xs font-semibold">
                                    {b.status_aktif ? 'Nonaktifkan' : 'Aktifkan'}
                                </button>
                                <button onClick={() => hapus(b)} className="text-danger text-xs font-semibold">Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </AdminLayout>
    );
}
