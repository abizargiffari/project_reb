<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class StockController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic StockController@index
        return Inertia::render('Placeholder', ['modul' => 'StockController', 'method' => 'index']);
    }

    public function storeMovement()
    {
        // TODO (Fase 4): implementasikan logic StockController@storeMovement
        return Inertia::render('Placeholder', ['modul' => 'StockController', 'method' => 'storeMovement']);
    }

}
