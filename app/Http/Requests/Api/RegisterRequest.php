<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
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
        $isIndividual = $this->input('account_type') === 'individual'
            || $this->input('account_type') === 'chauffeur';
        $isCompany = $this->input('account_type') === 'company';

        return [
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            'account_type' => ['required', 'string', Rule::in(['individual', 'company', 'chauffeur'])],
            'title' => [$isIndividual ? 'required' : 'nullable', 'string', Rule::in(['Mr.', 'Mrs.', 'Ms.', 'Mx.'])],
            'first_name' => [$isIndividual ? 'required' : 'nullable', 'string', 'max:255'],
            'last_name' => [$isIndividual ? 'required' : 'nullable', 'string', 'max:255'],
            'company_name' => [$isCompany ? 'required' : 'nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'min:8', 'max:30'],
            'preferred_language' => ['nullable', 'string', 'max:20'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }
}
