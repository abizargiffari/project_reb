<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\BlogPost;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class BlogController extends Controller
{
    public function index(Request $request): Response
    {
        $posts = BlogPost::with('author:id,name')
            ->when($request->search, fn ($q, $s) => $q->where('judul', 'like', "%{$s}%"))
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('Admin/Blog/Index', ['posts' => $posts, 'filters' => $request->only('search')]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Blog/Form', ['post' => null]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);

        $data['slug'] = $this->uniqueSlug($data['judul']);
        $data['author_id'] = $request->user()->id;
        $data['published_at'] = $request->boolean('terbitkan') ? now() : null;

        if ($request->hasFile('gambar')) {
            $data['gambar'] = $request->file('gambar')->store('blog', 'public');
        }

        $post = BlogPost::create($data);

        return redirect()->route('admin.blog.index')->with('success', "Artikel \"{$post->judul}\" berhasil disimpan.");
    }

    public function edit(BlogPost $blog): Response
    {
        return Inertia::render('Admin/Blog/Form', ['post' => $blog]);
    }

    public function update(Request $request, BlogPost $blog): RedirectResponse
    {
        $data = $this->validatedData($request);

        if ($data['judul'] !== $blog->judul) {
            $data['slug'] = $this->uniqueSlug($data['judul'], $blog->id);
        }

        $data['published_at'] = $request->boolean('terbitkan') ? ($blog->published_at ?? now()) : null;

        if ($request->hasFile('gambar')) {
            if ($blog->gambar) {
                Storage::disk('public')->delete($blog->gambar);
            }
            $data['gambar'] = $request->file('gambar')->store('blog', 'public');
        }

        $blog->update($data);

        return redirect()->route('admin.blog.index')->with('success', "Artikel \"{$blog->judul}\" berhasil diperbarui.");
    }

    public function destroy(BlogPost $blog): RedirectResponse
    {
        $blog->delete();

        return back()->with('success', 'Artikel dihapus.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'judul'            => ['required', 'string', 'max:255'],
            'konten'           => ['required', 'string'],
            'meta_title'       => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:255'],
            'gambar'           => ['nullable', 'image', 'max:2048'],
        ]);
    }

    private function uniqueSlug(string $judul, ?int $ignoreId = null): string
    {
        $slug = Str::slug($judul);
        $original = $slug;
        $i = 1;
        while (BlogPost::where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$original}-{$i}";
            $i++;
        }
        return $slug;
    }
}
