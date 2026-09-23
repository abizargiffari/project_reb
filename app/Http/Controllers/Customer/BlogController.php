<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BlogController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic BlogController@index
        return Inertia::render('Placeholder', ['modul' => 'BlogController', 'method' => 'index']);
    }

    public function show()
    {
        // TODO (Fase 4): implementasikan logic BlogController@show
        return Inertia::render('Placeholder', ['modul' => 'BlogController', 'method' => 'show']);
    }

}
