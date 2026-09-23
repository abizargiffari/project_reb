<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic OrderController@index
        return Inertia::render('Placeholder', ['modul' => 'OrderController', 'method' => 'index']);
    }

    public function show()
    {
        // TODO (Fase 4): implementasikan logic OrderController@show
        return Inertia::render('Placeholder', ['modul' => 'OrderController', 'method' => 'show']);
    }

    public function updateStatus()
    {
        // TODO (Fase 4): implementasikan logic OrderController@updateStatus
        return Inertia::render('Placeholder', ['modul' => 'OrderController', 'method' => 'updateStatus']);
    }

}
