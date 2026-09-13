<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    protected function prepareForValidation(): void
    {
        if ($this->has('customer_notes')) {
            $notes = trim(strip_tags((string) $this->input('customer_notes')));
            $this->merge([
                'customer_notes' => $notes === '' ? null : $notes,
            ]);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'quote_id' => ['required', 'integer', 'exists:quotes,id'],
            // No card, PayPal, or Stripe charge until a payment processor is connected.
            'payment_method_id' => ['prohibited'],
            'customer_notes' => ['nullable', 'string', 'max:2000'],
            'preferred_language' => ['nullable', 'string', Rule::in(['eng', 'ind', 'fr', 'phil', 'esp', 'jor', 'ita', 'ar'])],
            'for_myself' => ['nullable', 'boolean'],
            'guest' => ['nullable', 'array'],
            'guest.title' => ['nullable', 'string', 'max:20'],
            'guest.first_name' => ['required_with:guest', 'string', 'max:255'],
            'guest.last_name' => ['required_with:guest', 'string', 'max:255'],
            'guest.email' => ['nullable', 'email', 'max:255'],
            'guest.phone' => ['nullable', 'string', 'max:30'],
            'customer_reference' => ['prohibited'],
            'billing' => ['prohibited'],
            'cost_center_id' => ['prohibited'],
            'seat_addon_id' => ['prohibited'],
            'seat_addon' => ['prohibited'],
            'seat_addon_slug' => ['prohibited'],
            'subtotal' => ['prohibited'],
            'tax_amount' => ['prohibited'],
            'fees' => ['prohibited'],
            'discount' => ['prohibited'],
            'total' => ['prohibited'],
            'total_amount' => ['prohibited'],
        ];
    }
}
