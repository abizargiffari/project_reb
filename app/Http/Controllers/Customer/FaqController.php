<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Faq;
use Inertia\Inertia;
use Inertia\Response;

class FaqController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Customer/Static/Faq', [
            'faqsByKategori' => Faq::orderBy('urutan')->get()->groupBy(fn ($f) => $f->kategori ?? 'Umum'),
        ]);
    }
}
