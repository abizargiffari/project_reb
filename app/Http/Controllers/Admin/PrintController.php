<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PrintController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic PrintController@index
        return Inertia::render('Placeholder', ['modul' => 'PrintController', 'method' => 'index']);
    }

}
