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
        $isIndividual = $this->input('account_type') === 'individual';
        $isCompany = $this->input('account_type') === 'company';

        return [
            // Public signup is customer-only. Partners are created in Filament.
            'role' => ['prohibited'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'email_otp_token' => ['required', 'string', 'min:32', 'max:128'],
            'password' => ['required', 'string', 'confirmed', Password::defaults()],
            // company = customer who books under a company name (not a Partner portal account)
            'account_type' => ['required', 'string', Rule::in(['individual', 'company'])],
            'title' => [$isIndividual ? 'required' : 'nullable', 'string', Rule::in(['Mr.', 'Mrs.', 'Ms.', 'Mx.'])],
            'first_name' => [$isIndividual ? 'required' : 'nullable', 'string', 'max:255'],
            'last_name' => [$isIndividual ? 'required' : 'nullable', 'string', 'max:255'],
            'company_name' => [$isCompany ? 'required' : 'nullable', 'string', 'max:255'],
            'phone' => ['required', 'string', 'min:8', 'max:30'],
            'preferred_language' => ['nullable', 'string', Rule::in(['en', 'ar'])],
            'device_name' => ['nullable', 'string', 'max:255'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'email_otp_token.required' => __('api.auth.otp_token_required'),
        ];
    }
}
