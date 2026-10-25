import CustomerLayout from '@/Layouts/CustomerLayout';
import { mapsEmbedUrl, mapsOpenUrl, sosmedUrl, waUrl } from '@/Utils/format';
import { Head, useForm, usePage } from '@inertiajs/react';

const inputClass = 'w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary';

function Baris({ label, children }) {
    return (
        <div>
            <p className="text-xs text-text-secondary">{label}</p>
            <div className="text-sm font-medium">{children}</div>
        </div>
    );
}

export default function Contact() {
    const { flash, toko } = usePage().props;
    const { data, setData, post, processing, errors, reset } = useForm({ nama: '', email: '', telepon: '', subjek: '', pesan: '' });

    function submit(e) {
        e.preventDefault();
        post(route('contact.store'), { onSuccess: () => reset() });
    }

    const wa = waUrl(toko.whatsapp || toko.telepon);
    const ig = sosmedUrl('instagram', toko.instagram);
    const fb = sosmedUrl('facebook', toko.facebook);

    return (
        <CustomerLayout>
            <Head title="Hubungi Kami" />

            <div className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-2 text-2xl font-bold text-primary">Hubungi Kami</h1>
                <p className="mb-6 text-sm text-text-secondary">Ada pertanyaan atau masukan? Kirim pesan lewat form, atau hubungi kami langsung.</p>

                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Informasi kontak & peta */}
                    <div className="space-y-4">
                        <div className="space-y-3 rounded-xl2 bg-white p-6 shadow-sm">
                            <p className="font-bold text-primary">{toko.nama}</p>
                            {toko.alamat && <Baris label="Alamat">{toko.alamat}</Baris>}
                            {toko.telepon && (
                                <Baris label="Telepon / WhatsApp">
                                    <a href={`tel:${toko.telepon}`} className="hover:underline">{toko.telepon}</a>
                                    {wa && <a href={wa} target="_blank" rel="noreferrer" className="ml-3 text-xs font-semibold text-success hover:underline">Chat WhatsApp ↗</a>}
                                </Baris>
                            )}
                            {toko.email && <Baris label="Email"><a href={`mailto:${toko.email}`} className="hover:underline">{toko.email}</a></Baris>}
                            {toko.jam_operasional && <Baris label="Jam Operasional">{toko.jam_operasional}</Baris>}

                            {(ig || fb) && (
                                <Baris label="Media Sosial">
                                    <div className="flex gap-4">
                                        {ig && <a href={ig} target="_blank" rel="noreferrer" className="text-primary hover:underline">Instagram ↗</a>}
                                        {fb && <a href={fb} target="_blank" rel="noreferrer" className="text-primary hover:underline">Facebook ↗</a>}
                                    </div>
                                </Baris>
                            )}

                            {!toko.alamat && !toko.telepon && !toko.email && (
                                <p className="text-sm text-text-secondary">Informasi kontak belum diisi. Gunakan form di samping.</p>
                            )}
                        </div>

                        {toko.alamat && (
                            <div className="overflow-hidden rounded-xl2 bg-white shadow-sm">
                                <iframe
                                    title="Peta lokasi toko"
                                    src={mapsEmbedUrl(toko.alamat)}
                                    className="h-64 w-full border-0"
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                />
                                <a href={mapsOpenUrl(toko.alamat)} target="_blank" rel="noreferrer" className="block px-4 py-2.5 text-center text-xs font-semibold text-primary hover:bg-cream">
                                    Buka di Google Maps ↗
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Form kontak */}
                    <div>
                        {flash?.success && <div className="mb-4 rounded-xl bg-success-light px-4 py-3 text-sm font-medium text-success">{flash.success}</div>}

                        <form onSubmit={submit} className="rounded-xl2 bg-white p-6 shadow-sm">
                            <div className="mb-4 grid gap-3 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">Nama</label>
                                    <input className={inputClass} value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                                    {errors.nama && <p className="mt-1 text-xs text-danger">{errors.nama}</p>}
                                </div>
                                <div>
                                    <label className="mb-1.5 block text-xs font-semibold">Email</label>
                                    <input type="email" className={inputClass} value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                    {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-xs font-semibold">Telepon (opsional)</label>
                                <input className={inputClass} value={data.telepon} onChange={(e) => setData('telepon', e.target.value)} />
                            </div>
                            <div className="mb-4">
                                <label className="mb-1.5 block text-xs font-semibold">Subjek</label>
                                <input className={inputClass} value={data.subjek} onChange={(e) => setData('subjek', e.target.value)} />
                            </div>
                            <div className="mb-5">
                                <label className="mb-1.5 block text-xs font-semibold">Pesan</label>
                                <textarea rows={5} className={inputClass} value={data.pesan} onChange={(e) => setData('pesan', e.target.value)} />
                                {errors.pesan && <p className="mt-1 text-xs text-danger">{errors.pesan}</p>}
                            </div>
                            <button type="submit" disabled={processing} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
                                {processing ? 'Mengirim...' : 'Kirim Pesan'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
