import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

export default function Contact() {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ nama: '', email: '', telepon: '', subjek: '', pesan: '' });

    function submit(e) {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    }

    return (
        <CustomerLayout>
            <Head title="Hubungi Kami" />
            <div className="mx-auto max-w-xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-2">Hubungi Kami</h1>
                <p className="text-sm text-text-secondary mb-6">Ada pertanyaan atau masukan? Kirim pesan lewat form di bawah.</p>

                {flash?.success && <div className="mb-4 rounded-xl bg-success-light text-success px-4 py-3 text-sm font-medium">{flash.success}</div>}

                <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6">
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-xs font-semibold mb-1.5">Nama</label>
                            <input className={inputClass} value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                            {errors.nama && <p className="text-xs text-danger mt-1">{errors.nama}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-semibold mb-1.5">Email</label>
                            <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            {errors.email && <p className="text-xs text-danger mt-1">{errors.email}</p>}
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1.5">Telepon (opsional)</label>
                        <input className={inputClass} value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-xs font-semibold mb-1.5">Subjek</label>
                        <input className={inputClass} value={data.subjek} onChange={(e) => setData('subjek', e.target.value)} />
                    </div>
                    <div className="mb-5">
                        <label className="block text-xs font-semibold mb-1.5">Pesan</label>
                        <textarea rows={4} className={inputClass} value={data.pesan} onChange={(e) => setData('pesan', e.target.value)} />
                        {errors.pesan && <p className="text-xs text-danger mt-1">{errors.pesan}</p>}
                    </div>
                    <button type="submit" disabled={processing} className="bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                        {processing ? 'Mengirim...' : 'Kirim Pesan'}
                    </button>
                </form>
            </div>
        </CustomerLayout>
    );
}
