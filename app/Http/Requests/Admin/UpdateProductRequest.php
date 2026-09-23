<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'category_id' => ['required', 'exists:categories,id'],
            'nama' => ['required', 'string', 'max:255'],
            'deskripsi' => ['nullable', 'string'],
            'satuan' => ['required', 'in:ikat,kg,gram,bungkus,paket,papan'],
            'harga_jual' => ['required', 'numeric', 'min:0'],
            'harga_modal' => ['required', 'numeric', 'min:0'],
            'harga_coret' => ['nullable', 'numeric', 'min:0', 'gt:harga_jual'],
            'stok' => ['required', 'integer', 'min:0'],
            'stok_minimum' => ['required', 'integer', 'min:0'],
            'badge' => ['nullable', 'string', 'max:50'],
            'catatan_stok' => ['nullable', 'string', 'max:100'],
            'status' => ['required', 'in:aktif,nonaktif'],
            'gambar' => ['nullable', 'image', 'max:2048'],
        ];
    }
}
