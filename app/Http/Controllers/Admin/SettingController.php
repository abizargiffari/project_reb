<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SettingController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): implementasikan logic SettingController@index
        return Inertia::render('Placeholder', ['modul' => 'SettingController', 'method' => 'index']);
    }

    public function update()
    {
        // TODO (Fase 4): implementasikan logic SettingController@update
        return Inertia::render('Placeholder', ['modul' => 'SettingController', 'method' => 'update']);
    }

}
