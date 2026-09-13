<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class CancelBookingRequest extends FormRequest
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
            'reason_id' => ['nullable', 'integer', 'required_without:note'],
            'note' => ['nullable', 'string', 'min:3', 'max:500', 'required_without:reason_id'],
        ];
    }
}
