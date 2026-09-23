<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WishlistController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic WishlistController@index
        return Inertia::render('Placeholder', ['modul' => 'WishlistController', 'method' => 'index']);
    }

    public function store()
    {
        // TODO (Fase 4): implementasikan logic WishlistController@store
        return Inertia::render('Placeholder', ['modul' => 'WishlistController', 'method' => 'store']);
    }

    public function destroy()
    {
        // TODO (Fase 4): implementasikan logic WishlistController@destroy
        return Inertia::render('Placeholder', ['modul' => 'WishlistController', 'method' => 'destroy']);
    }

}
