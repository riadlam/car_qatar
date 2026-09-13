<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'number' => ['required', 'string', 'max:23'],
            'holder_name' => ['required', 'string', 'max:100'],
            'expiry' => ['required', 'string', 'max:5'],
            'cvc' => ['required', 'string', 'max:4'],
        ];
    }
}
