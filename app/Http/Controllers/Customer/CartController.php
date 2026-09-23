<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic CartController@index
        return Inertia::render('Placeholder', ['modul' => 'CartController', 'method' => 'index']);
    }

    public function store()
    {
        // TODO (Fase 4): implementasikan logic CartController@store
        return Inertia::render('Placeholder', ['modul' => 'CartController', 'method' => 'store']);
    }

    public function update()
    {
        // TODO (Fase 4): implementasikan logic CartController@update
        return Inertia::render('Placeholder', ['modul' => 'CartController', 'method' => 'update']);
    }

    public function destroy()
    {
        // TODO (Fase 4): implementasikan logic CartController@destroy
        return Inertia::render('Placeholder', ['modul' => 'CartController', 'method' => 'destroy']);
    }

}
