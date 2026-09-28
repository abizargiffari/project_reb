<?php

namespace App\Http\Requests\Customer;

use Illuminate\Foundation\Http\FormRequest;

class StoreCheckoutRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    public function rules(): array
    {
        return [
            'nama_penerima'         => ['required', 'string', 'max:100'],
            'telepon_penerima'      => ['required', 'regex:/^(\+62|62|0)8[0-9]{8,12}$/'],
            'alamat_lengkap'        => ['required', 'string', 'max:500'],
            'catatan_patokan'       => ['nullable', 'string', 'max:300'],
            'simpan_alamat'         => ['boolean'],
            'delivery_batch_id'     => ['required', 'exists:delivery_batches,id'],
            'metode_bayar'          => ['required', 'in:cod,qris,va'],
            'cod_nominal_disiapkan' => ['nullable', 'numeric', 'min:0'],
            'voucher_kode'          => ['nullable', 'string', 'max:50'],
        ];
    }

    public function attributes(): array
    {
        return [
            'nama_penerima'     => 'nama penerima',
            'telepon_penerima'  => 'nomor telepon',
            'alamat_lengkap'    => 'alamat lengkap',
            'delivery_batch_id' => 'jam antar',
            'metode_bayar'      => 'metode pembayaran',
        ];
    }

    public function messages(): array
    {
        return [
            'telepon_penerima.regex' => 'Nomor telepon/WhatsApp tidak valid. Contoh: 081234567890.',
            'delivery_batch_id.required' => 'Pilih salah satu jam antar kurir.',
        ];
    }
}
