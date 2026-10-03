<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customer/Blog/Index', [
            'posts' => BlogPost::published()
                ->with('author:id,name')
                ->latest('published_at')
                ->paginate(9)
                ->through(fn ($p) => [
                    'judul' => $p->judul, 'slug' => $p->slug, 'gambar' => $p->gambar,
                    'published_at' => $p->published_at, 'author' => $p->author?->name,
                    'ringkasan' => \Illuminate\Support\Str::limit(strip_tags($p->konten), 150),
                ]),
        ]);
    }

    public function show(BlogPost $blogPost): Response
    {
        abort_unless($blogPost->published_at && $blogPost->published_at->isPast(), 404);

        $lainnya = BlogPost::published()
            ->where('id', '!=', $blogPost->id)
            ->latest('published_at')
            ->limit(3)
            ->get(['judul', 'slug', 'gambar']);

        return Inertia::render('Customer/Blog/Show', [
            'post'    => $blogPost->load('author:id,name'),
            'lainnya' => $lainnya,
        ]);
    }
}
