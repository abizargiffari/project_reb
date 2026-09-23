<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'nama' => ['required', 'string', 'max:100', Rule::unique('categories', 'nama')->ignore($this->route('category'))],
            'icon' => ['nullable', 'string', 'max:50'],
            'urutan' => ['nullable', 'integer', 'min:0'],
            'status_aktif' => ['boolean'],
        ];
    }
}
