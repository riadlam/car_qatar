<?php

namespace App\Http\Requests\Api;

use App\Support\Countries;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpsertBillingProfileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'company' => $this->filled('company') ? trim(strip_tags((string) $this->input('company'))) : null,
            'street' => trim(strip_tags((string) $this->input('street'))),
            'zip' => trim(strip_tags((string) $this->input('zip'))),
            'city' => trim(strip_tags((string) $this->input('city'))),
            'country' => trim(strip_tags((string) $this->input('country'))),
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'company' => ['nullable', 'string', 'max:255'],
            'street' => ['required', 'string', 'max:255'],
            'zip' => ['required', 'string', 'max:32'],
            'city' => ['required', 'string', 'max:255'],
            'country' => ['required', 'string', Rule::in(Countries::names())],
        ];
    }
}
