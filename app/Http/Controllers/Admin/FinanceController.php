<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FinanceController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic FinanceController@index
        return Inertia::render('Placeholder', ['modul' => 'FinanceController', 'method' => 'index']);
    }

    public function storeTransaction()
    {
        // TODO (Fase 4): implementasikan logic FinanceController@storeTransaction
        return Inertia::render('Placeholder', ['modul' => 'FinanceController', 'method' => 'storeTransaction']);
    }

}
