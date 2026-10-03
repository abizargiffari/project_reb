import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Field({ label, error, children }) {
    return (
        <div className="mb-4">
            <label className="block text-xs font-semibold mb-1.5">{label}</label>
            {children}
            {error && <p className="text-xs text-danger mt-1">{error}</p>}
        </div>
    );
}

export default function Form({ post }) {
    const isEdit = !!post;

    const { data, setData, post: submitPost, processing, errors } = useForm({
        judul: post?.judul ?? '',
        konten: post?.konten ?? '',
        meta_title: post?.meta_title ?? '',
        meta_description: post?.meta_description ?? '',
        gambar: null,
        terbitkan: !!post?.published_at,
        _method: isEdit ? 'put' : 'post',
    });

    function submit(e) {
        e.preventDefault();
        const url = isEdit ? route('admin.blog.update', post.id) : route('admin.blog.store');
        submitPost(url, { forceFormData: true });
    }

    return (
        <AdminLayout>
            <Head title={isEdit ? 'Edit Artikel' : 'Tulis Artikel'} />
            <h1 className="text-2xl font-bold text-primary mb-6">{isEdit ? 'Edit Artikel' : 'Tulis Artikel Baru'}</h1>

            <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 max-w-2xl">
                <Field label="Judul" error={errors.judul}>
                    <input className={inputClass} value={data.judul} onChange={(e) => setData('judul', e.target.value)} />
                </Field>

                <Field label="Konten" error={errors.konten}>
                    <textarea rows={10} className={inputClass} value={data.konten} onChange={(e) => setData('konten', e.target.value)} />
                    <p className="text-xs text-text-secondary mt-1">Mendukung HTML dasar (paragraf, bold, link) — ditampilkan apa adanya di halaman artikel.</p>
                </Field>

                <div className="bg-cream rounded-xl p-4 mb-4">
                    <p className="text-xs font-semibold text-primary mb-3">SEO (opsional, untuk pencarian Google)</p>
                    <Field label="Meta Title" error={errors.meta_title}>
                        <input className={inputClass} value={data.meta_title} onChange={(e) => setData('meta_title', e.target.value)} maxLength={160} />
                    </Field>
                    <Field label="Meta Description" error={errors.meta_description}>
                        <textarea rows={2} className={inputClass} value={data.meta_description} onChange={(e) => setData('meta_description', e.target.value)} maxLength={255} />
                    </Field>
                </div>

                <Field label={`Gambar Utama ${isEdit ? '(kosongkan jika tidak diganti)' : ''}`} error={errors.gambar}>
                    <input type="file" accept="image/*" onChange={(e) => setData('gambar', e.target.files[0])} />
                    {isEdit && post.gambar && <img src={`/storage/${post.gambar}`} alt="" className="w-32 h-20 object-cover rounded-lg mt-2" />}
                </Field>

                <label className="flex items-center gap-2 text-sm mb-5">
                    <input type="checkbox" checked={data.terbitkan} onChange={(e) => setData('terbitkan', e.target.checked)} />
                    Terbitkan sekarang (kalau tidak dicentang, tersimpan sebagai draft)
                </label>

                <button type="submit" disabled={processing} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                    {processing ? 'Menyimpan...' : 'Simpan Artikel'}
                </button>
            </form>
        </AdminLayout>
    );
}
