<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProfileRequest extends FormRequest
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
        $user = $this->user();
        $accountType = $this->input('account_type', $user?->account_type);
        $isIndividual = $accountType === 'individual';
        $isCompany = $accountType === 'company';

        return [
            'account_type' => ['sometimes', 'string', Rule::in(['individual', 'company'])],
            'title' => ['sometimes', 'nullable', 'string', Rule::in(['Mr.', 'Mrs.', 'Ms.', 'Mx.'])],
            'first_name' => [$isIndividual && $this->has('first_name') ? 'required' : 'sometimes', 'nullable', 'string', 'max:255'],
            'last_name' => [$isIndividual && $this->has('last_name') ? 'required' : 'sometimes', 'nullable', 'string', 'max:255'],
            'company_name' => [$isCompany && ($this->has('company_name') || $this->has('company')) ? 'required' : 'sometimes', 'nullable', 'string', 'max:255'],
            'company' => ['sometimes', 'nullable', 'string', 'max:255'],
            'phone' => ['sometimes', 'nullable', 'string', 'min:8', 'max:30'],
            'preferred_language' => ['sometimes', 'nullable', 'string', 'max:20'],
            'street_address' => ['sometimes', 'nullable', 'string', 'max:500'],
            'language' => ['sometimes', 'string', Rule::in(['en', 'fr', 'ar', 'de'])],
            'marketing_emails' => ['sometimes', 'boolean'],
            'booking_notifications' => ['sometimes', 'string', Rule::in(['email_sms', 'email', 'sms', 'off'])],
        ];
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('company') && ! $this->has('company_name')) {
            $this->merge([
                'company_name' => $this->input('company'),
            ]);
        }
    }
}
