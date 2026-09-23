<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CustomerController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic CustomerController@index
        return Inertia::render('Placeholder', ['modul' => 'CustomerController', 'method' => 'index']);
    }

}
