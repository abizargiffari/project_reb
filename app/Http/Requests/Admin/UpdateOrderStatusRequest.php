<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateOrderStatusRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'status_pesanan' => ['required', 'in:diproses,diantar,selesai,dibatalkan'],
            'keterangan'     => ['nullable', 'string', 'max:255'],
        ];
    }
}
