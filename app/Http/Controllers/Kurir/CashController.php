<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CashController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic CashController@index
        return Inertia::render('Placeholder', ['modul' => 'CashController', 'method' => 'index']);
    }

    public function store()
    {
        // TODO (Fase 4): implementasikan logic CashController@store
        return Inertia::render('Placeholder', ['modul' => 'CashController', 'method' => 'store']);
    }

}
