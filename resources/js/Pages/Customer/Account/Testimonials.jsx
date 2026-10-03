import CustomerLayout from '@/Layouts/CustomerLayout';
import Badge from '@/Components/UI/Badge';
import { Head, useForm, usePage } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

export default function Testimonials({ ulasanSaya, sudahPernahBelanja }) {
    const { flash } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ rating: 5, isi: '', label: '' });

    function submit(e) {
        e.preventDefault();
        post(route('account.testimonials.store'), { onSuccess: () => reset('isi') });
    }

    return (
        <CustomerLayout>
            <Head title="Ulasan Saya" />
            <div className="mx-auto max-w-xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-2">Ulasan Saya</h1>
                <p className="text-sm text-text-secondary mb-6">Bagikan pengalaman belanja Anda — ulasan akan tampil di beranda setelah ditinjau tim kami.</p>

                {flash?.success && <div className="mb-4 rounded-xl bg-success-light text-success px-4 py-3 text-sm font-medium">{flash.success}</div>}
                {flash?.error && <div className="mb-4 rounded-xl bg-danger-light text-danger px-4 py-3 text-sm font-medium">{flash.error}</div>}

                {sudahPernahBelanja ? (
                    <form onSubmit={submit} className="bg-white rounded-xl2 shadow-sm p-6 mb-6">
                        <label className="block text-xs font-semibold mb-1.5">Rating</label>
                        <select className={inputClass + ' mb-4'} value={data.rating} onChange={(e) => setData('rating', e.target.value)}>
                            {[5, 4, 3, 2, 1].map((r) => <option key={r} value={r}>{r} Bintang</option>)}
                        </select>
                        <label className="block text-xs font-semibold mb-1.5">Label (opsional, mis. "Pelanggan Jagakarsa")</label>
                        <input className={inputClass + ' mb-4'} value={data.label} onChange={(e) => setData('label', e.target.value)} />
                        <label className="block text-xs font-semibold mb-1.5">Ulasan Anda</label>
                        <textarea rows={3} className={inputClass} value={data.isi} onChange={(e) => setData('isi', e.target.value)} />
                        {errors.isi && <p className="text-xs text-danger mt-1">{errors.isi}</p>}
                        <button type="submit" disabled={processing} className="mt-4 bg-primary text-white px-6 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
                            {processing ? 'Mengirim...' : 'Kirim Ulasan'}
                        </button>
                    </form>
                ) : (
                    <div className="bg-cream rounded-xl2 p-5 text-sm text-text-secondary mb-6">
                        Ulasan hanya bisa diberikan setelah Anda pernah berbelanja dan pembayarannya lunas.
                    </div>
                )}

                {ulasanSaya.length > 0 && (
                    <>
                        <p className="font-bold text-primary mb-3">Riwayat Ulasan Anda</p>
                        <div className="space-y-3">
                            {ulasanSaya.map((t) => (
                                <div key={t.id} className="bg-white rounded-xl2 shadow-sm p-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-yellow-500 text-sm">{'★'.repeat(t.rating)}</span>
                                        <Badge color={t.status_tampil ? 'success' : 'orange'}>{t.status_tampil ? 'Tampil di Beranda' : 'Menunggu Moderasi'}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-2">{t.isi}</p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </CustomerLayout>
    );
}
