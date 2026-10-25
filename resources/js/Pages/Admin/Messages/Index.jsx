import AdminLayout from '@/Layouts/AdminLayout';
import Badge from '@/Components/UI/Badge';
import { Head, Link, router, useForm } from '@inertiajs/react';

const statusColor = { baru: 'orange', dibaca: 'neutral', dibalas: 'success' };
const statusLabel = { baru: 'Baru', dibaca: 'Dibaca', dibalas: 'Dibalas' };

export default function Index({ messages, filters }) {
    const { data, setData } = useForm({ status: filters.status ?? '' });

    function applyFilter(v) {
        setData('status', v);
        router.get(route('admin.messages.index'), v ? { status: v } : {}, { preserveState: true, replace: true });
    }

    function ubahStatus(m, status) {
        router.patch(route('admin.messages.update', m.id), { status }, { preserveScroll: true });
    }

    function hapus(m) {
        if (confirm(`Hapus pesan dari "${m.nama}"?`)) router.delete(route('admin.messages.destroy', m.id), { preserveScroll: true });
    }

    return (
        <AdminLayout>
            <Head title="Pesan Masuk" />

            <div className="mb-6">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-orange">Modul Pelanggan</p>
                <h1 className="text-2xl font-bold text-primary">Pesan Masuk</h1>
                <p className="text-sm text-text-secondary">Pesan dari form Hubungi Kami di situs.</p>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {[['', 'Semua'], ['baru', 'Baru'], ['dibaca', 'Dibaca'], ['dibalas', 'Dibalas']].map(([v, label]) => (
                    <button key={v} onClick={() => applyFilter(v)} className={`rounded-full px-4 py-1.5 text-sm font-medium ${data.status === v ? 'bg-primary text-white' : 'bg-white text-gray-600'}`}>
                        {label}
                    </button>
                ))}
            </div>

            <div className="space-y-3">
                {messages.data.length === 0 && <p className="text-sm text-text-secondary">Tidak ada pesan.</p>}
                {messages.data.map((m) => (
                    <div key={m.id} className={`rounded-xl2 bg-white p-4 shadow-sm ${m.status === 'baru' ? 'border-l-4 border-accent-orange' : ''}`}>
                        <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                                <p className="font-bold">{m.subjek || '(tanpa subjek)'}</p>
                                <p className="text-xs text-text-secondary">
                                    {m.nama} • {m.email}{m.telepon ? ` • ${m.telepon}` : ''} • {new Date(m.created_at).toLocaleString('id-ID')}
                                </p>
                            </div>
                            <Badge color={statusColor[m.status]}>{statusLabel[m.status]}</Badge>
                        </div>

                        <p className="mt-3 whitespace-pre-line text-sm text-gray-700">{m.pesan}</p>

                        <div className="mt-3 flex flex-wrap gap-4 text-sm font-semibold">
                            <a
                                href={`mailto:${m.email}?subject=${encodeURIComponent('Re: ' + (m.subjek || 'Pesan Anda'))}`}
                                onClick={() => m.status !== 'dibalas' && ubahStatus(m, 'dibalas')}
                                className="text-primary"
                            >
                                Balas via Email
                            </a>
                            {m.status === 'baru' && <button onClick={() => ubahStatus(m, 'dibaca')} className="text-primary">Tandai Dibaca</button>}
                            {m.status !== 'dibalas' && <button onClick={() => ubahStatus(m, 'dibalas')} className="text-primary">Tandai Dibalas</button>}
                            <button onClick={() => hapus(m)} className="text-danger">Hapus</button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 flex justify-center gap-1">
                {messages.links.map((link, i) => (
                    <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                        className={`rounded-lg px-3 py-1.5 text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'pointer-events-none opacity-40' : ''}`} />
                ))}
            </div>
        </AdminLayout>
    );
}
