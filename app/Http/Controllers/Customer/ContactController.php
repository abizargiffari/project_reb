<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Mail\NewContactMessage;
use App\Models\ContactMessage;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'nama'    => ['required', 'string', 'max:100'],
            'email'   => ['required', 'email', 'max:150'],
            'telepon' => ['nullable', 'string', 'max:30'],
            'subjek'  => ['nullable', 'string', 'max:150'],
            'pesan'   => ['required', 'string', 'max:2000'],
        ]);

        $pesan = ContactMessage::create([...$data, 'status' => 'baru']);

        // Kegagalan kirim email TIDAK boleh membuat pelanggan mengira pesannya gagal terkirim —
        // pesan SUDAH tersimpan di atas apa pun yang terjadi dengan email setelahnya.
        $tujuan = Setting::get('admin_notification_email');
        if ($tujuan) {
            try {
                Mail::to($tujuan)->send(new NewContactMessage($pesan));
            } catch (\Throwable $e) {
                report($e);
            }
        }

        return back()->with('success', 'Pesan Anda berhasil terkirim. Tim kami akan segera membalas.');
    }
}
