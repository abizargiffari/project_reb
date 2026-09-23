import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Form({ category }) {
    const isEdit = !!category;

    const { data, setData, post, put, processing, errors } = useForm({
        nama: category?.nama ?? '',
        icon: category?.icon ?? '',
        urutan: category?.urutan ?? 0,
        status_aktif: category?.status_aktif ?? true,
    });

    function submit(e) {
        e.preventDefault();
        if (isEdit) {
            put(route('admin.kategori.update', category.id));
        } else {
            post(route('admin.kategori.store'));
        }
    }

    const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'} />
            <h1 className="text-2xl font-bold text-primary mb-6">{isEdit ? 'Edit Kategori' : 'Tambah Kategori'}</h1>

            <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-lg">
                <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5">Nama Kategori *</label>
                    <input className={inputClass} value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                    {errors.nama && <p className="text-xs text-danger mt-1">{errors.nama}</p>}
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5">Icon (nama ikon, opsional)</label>
                    <input className={inputClass} value={data.icon} onChange={(e) => setData('icon', e.target.value)} />
                </div>

                <div className="mb-4">
                    <label className="block text-xs font-semibold mb-1.5">Urutan Tampil</label>
                    <input type="number" className={inputClass} value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} />
                </div>

                <label className="flex items-center gap-2 text-sm mb-6">
                    <input type="checkbox" checked={data.status_aktif} onChange={(e) => setData('status_aktif', e.target.checked)} />
                    Tampilkan kategori ini di katalog
                </label>

                <button type="submit" disabled={processing} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {processing ? 'Menyimpan...' : 'Simpan'}
                </button>
            </form>
        </AdminLayout>
    );
}
