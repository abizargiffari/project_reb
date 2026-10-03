<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Faq/Index', ['faqs' => Faq::orderBy('urutan')->get()]);
    }

    public function store(Request $request): RedirectResponse
    {
        $data = $this->validatedData($request);
        $data['urutan'] = $data['urutan'] ?? ((int) (Faq::max('urutan') ?? 0) + 1);

        Faq::create($data);

        return back()->with('success', 'FAQ ditambahkan.');
    }

    public function update(Request $request, Faq $faq): RedirectResponse
    {
        $faq->update($this->validatedData($request));

        return back()->with('success', 'FAQ diperbarui.');
    }

    public function destroy(Faq $faq): RedirectResponse
    {
        $faq->delete();

        return back()->with('success', 'FAQ dihapus.');
    }

    private function validatedData(Request $request): array
    {
        return $request->validate([
            'kategori'   => ['nullable', 'string', 'max:100'],
            'pertanyaan' => ['required', 'string', 'max:255'],
            'jawaban'    => ['required', 'string', 'max:2000'],
            'urutan'     => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
