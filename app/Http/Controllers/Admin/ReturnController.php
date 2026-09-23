<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReturnController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic ReturnController@index
        return Inertia::render('Placeholder', ['modul' => 'ReturnController', 'method' => 'index']);
    }

    public function update()
    {
        // TODO (Fase 4): implementasikan logic ReturnController@update
        return Inertia::render('Placeholder', ['modul' => 'ReturnController', 'method' => 'update']);
    }

}
