<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CheckoutController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic CheckoutController@index
        return Inertia::render('Placeholder', ['modul' => 'CheckoutController', 'method' => 'index']);
    }

    public function store()
    {
        // TODO (Fase 4): implementasikan logic CheckoutController@store
        return Inertia::render('Placeholder', ['modul' => 'CheckoutController', 'method' => 'store']);
    }

    public function success()
    {
        // TODO (Fase 4): implementasikan logic CheckoutController@success
        return Inertia::render('Placeholder', ['modul' => 'CheckoutController', 'method' => 'success']);
    }

}
