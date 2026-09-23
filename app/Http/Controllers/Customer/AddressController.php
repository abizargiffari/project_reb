<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AddressController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic AddressController@index
        return Inertia::render('Placeholder', ['modul' => 'AddressController', 'method' => 'index']);
    }

}
