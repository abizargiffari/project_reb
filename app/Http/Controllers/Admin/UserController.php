<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        // TODO (Fase 4): list data + pagination
        return Inertia::render('Placeholder', ['modul' => 'UserController', 'method' => 'index']);
    }

    public function create()
    {
        return Inertia::render('Placeholder', ['modul' => 'UserController', 'method' => 'create']);
    }

    public function store(Request $request)
    {
        // TODO (Fase 4): validasi + simpan
    }

    public function edit($id)
    {
        return Inertia::render('Placeholder', ['modul' => 'UserController', 'method' => 'edit']);
    }

    public function update(Request $request, $id)
    {
        // TODO (Fase 4): validasi + update
    }

    public function destroy($id)
    {
        // TODO (Fase 4): hapus data
    }
}
