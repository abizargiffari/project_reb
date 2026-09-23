<?php

namespace App\Http\Controllers\Kurir;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic RouteController@index
        return Inertia::render('Placeholder', ['modul' => 'RouteController', 'method' => 'index']);
    }

    public function complete()
    {
        // TODO (Fase 4): implementasikan logic RouteController@complete
        return Inertia::render('Placeholder', ['modul' => 'RouteController', 'method' => 'complete']);
    }

}
