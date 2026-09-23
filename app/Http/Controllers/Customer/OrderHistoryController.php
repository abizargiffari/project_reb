<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderHistoryController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic OrderHistoryController@index
        return Inertia::render('Placeholder', ['modul' => 'OrderHistoryController', 'method' => 'index']);
    }

    public function show()
    {
        // TODO (Fase 4): implementasikan logic OrderHistoryController@show
        return Inertia::render('Placeholder', ['modul' => 'OrderHistoryController', 'method' => 'show']);
    }

}
