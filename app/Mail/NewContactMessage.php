<?php

namespace App\Mail;

use App\Models\ContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NewContactMessage extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $pesan) {}

    public function build(): self
    {
        return $this->subject('Pesan Baru dari Form Kontak — ' . $this->pesan->nama)
            ->view('emails.new-contact-message');
    }
}
