import AdminLayout from '@/Layouts/AdminLayout';
import { Head, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function FormFaq({ faq, onClose }) {
    const { data, setData, post, patch, processing, errors } = useForm({
        kategori: faq?.kategori ?? '', pertanyaan: faq?.pertanyaan ?? '', jawaban: faq?.jawaban ?? '', urutan: faq?.urutan ?? '',
    });

    function submit(e) {
        e.preventDefault();
        const opts = { preserveScroll: true, onSuccess: onClose };
        faq ? patch(route('admin.faq.update', faq.id), opts) : post(route('admin.faq.store'), opts);
    }

    return (
        <form onSubmit={submit} className="bg-cream rounded-xl p-4 mb-3">
            <div className="grid grid-cols-2 gap-3 mb-3">
                <input className={inputClass} placeholder="Kategori (mis. Pemesanan)" value={data.kategori} onChange={(e) => setData('kategori', e.target.value)} />
                <input type="number" className={inputClass} placeholder="Urutan" value={data.urutan} onChange={(e) => setData('urutan', e.target.value)} />
            </div>
            <input className={inputClass + ' mb-3'} placeholder="Pertanyaan" value={data.pertanyaan} onChange={(e) => setData('pertanyaan', e.target.value)} />
            {errors.pertanyaan && <p className="text-xs text-danger mb-2">{errors.pertanyaan}</p>}
            <textarea rows={3} className={inputClass + ' mb-3'} placeholder="Jawaban" value={data.jawaban} onChange={(e) => setData('jawaban', e.target.value)} />
            <div className="flex gap-2">
                <button type="submit" disabled={processing} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold">Simpan</button>
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-semibold text-text-secondary">Batal</button>
            </div>
        </form>
    );
}

export default function Index({ faqs }) {
    const [tambah, setTambah] = useState(false);
    const [edit, setEdit] = useState(null);

    function hapus(f) {
        if (confirm(`Hapus FAQ "${f.pertanyaan}"?`)) router.delete(route('admin.faq.destroy', f.id), { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="FAQ" />
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-wide text-accent-orange font-semibold">Modul Konten</p>
                    <h1 className="text-2xl font-bold text-primary">FAQ</h1>
                </div>
                <button onClick={() => { setTambah(!tambah); setEdit(null); }} className="bg-primary text-white px-5 py-2.5 rounded-xl text-sm font-semibold">
                    {tambah ? 'Tutup' : '+ Tambah FAQ'}
                </button>
            </div>

            <div className="bg-white rounded-xl2 shadow-sm p-5 max-w-2xl">
                {tambah && <FormFaq onClose={() => setTambah(false)} />}
                <div className="divide-y divide-gray-100">
                    {faqs.map((f) => (
                        <div key={f.id} className="py-3">
                            {edit === f.id ? (
                                <FormFaq faq={f} onClose={() => setEdit(null)} />
                            ) : (
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-accent-orange font-semibold">{f.kategori}</p>
                                        <p className="font-semibold text-sm">{f.pertanyaan}</p>
                                        <p className="text-xs text-text-secondary mt-1">{f.jawaban}</p>
                                    </div>
                                    <div className="flex gap-2 flex-shrink-0">
                                        <button onClick={() => setEdit(f.id)} className="text-primary text-xs font-semibold">Edit</button>
                                        <button onClick={() => hapus(f)} className="text-danger text-xs font-semibold">Hapus</button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
