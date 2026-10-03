import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ posts }) {
    return (
        <CustomerLayout>
            <Head title="Blog & Artikel" />
            <div className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="text-2xl font-bold text-primary mb-6">Blog & Artikel</h1>

                {posts.data.length === 0 ? (
                    <p className="text-text-secondary">Belum ada artikel.</p>
                ) : (
                    <div className="grid md:grid-cols-3 gap-5">
                        {posts.data.map((p) => (
                            <Link key={p.slug} href={route('blog.show', p.slug)} className="bg-white rounded-xl2 shadow-sm overflow-hidden block">
                                <div className="aspect-video bg-cream">
                                    {p.gambar && <img src={`/storage/${p.gambar}`} alt={p.judul} className="w-full h-full object-cover" />}
                                </div>
                                <div className="p-4">
                                    <p className="text-xs text-text-secondary">{new Date(p.published_at).toLocaleDateString('id-ID')} • {p.author}</p>
                                    <p className="font-bold mt-1 line-clamp-2">{p.judul}</p>
                                    <p className="text-sm text-text-secondary mt-1 line-clamp-2">{p.ringkasan}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="flex justify-center gap-1 mt-8">
                    {posts.links.map((link, i) => (
                        <Link key={i} href={link.url ?? '#'} dangerouslySetInnerHTML={{ __html: link.label }}
                            className={`px-3 py-1.5 rounded-lg text-sm ${link.active ? 'bg-primary text-white' : 'bg-white text-text-secondary'} ${!link.url ? 'opacity-40 pointer-events-none' : ''}`} />
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
