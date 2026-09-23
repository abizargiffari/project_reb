<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:100', 'unique:categories,nama'],
            'icon' => ['nullable', 'string', 'max:50'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'status_aktif' => ['boolean'],
        ];
    }
}
