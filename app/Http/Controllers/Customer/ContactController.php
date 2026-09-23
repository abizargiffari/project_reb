<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function store()
    {
        // TODO (Fase 4): implementasikan logic ContactController@store
        return Inertia::render('Placeholder', ['modul' => 'ContactController', 'method' => 'store']);
    }

}
