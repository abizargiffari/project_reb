<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MidtransCallbackController extends Controller
{
    public function handle()
    {
        // TODO (Fase 4): implementasikan logic MidtransCallbackController@handle
        return Inertia::render('Placeholder', ['modul' => 'MidtransCallbackController', 'method' => 'handle']);
    }

}
