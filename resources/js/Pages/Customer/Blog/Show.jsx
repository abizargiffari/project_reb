import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Show({ post, lainnya }) {
    return (
        <CustomerLayout>
            <Head title={post.meta_title || post.judul}>
                {post.meta_description && <meta name="description" content={post.meta_description} />}
            </Head>

            <article className="mx-auto max-w-2xl px-4 py-8">
                <p className="text-xs text-text-secondary">{new Date(post.published_at).toLocaleDateString('id-ID')} • {post.author?.name}</p>
                <h1 className="text-2xl font-bold text-primary mt-1 mb-4">{post.judul}</h1>
                {post.gambar && <img src={`/storage/${post.gambar}`} alt={post.judul} className="w-full rounded-xl2 mb-6" />}
                <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: post.konten }} />
            </article>

            {lainnya.length > 0 && (
                <div className="mx-auto max-w-2xl px-4 pb-10">
                    <p className="font-bold text-primary mb-3">Artikel Lainnya</p>
                    <div className="grid grid-cols-3 gap-3">
                        {lainnya.map((p) => (
                            <Link key={p.slug} href={route('blog.show', p.slug)} className="text-sm font-semibold hover:underline">{p.judul}</Link>
                        ))}
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
