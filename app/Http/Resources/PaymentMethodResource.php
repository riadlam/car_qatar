<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin \App\Models\PaymentMethod
 */
class PaymentMethodResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $month = str_pad((string) $this->exp_month, 2, '0', STR_PAD_LEFT);
        $year = substr((string) $this->exp_year, -2);

        return [
            'id' => $this->id,
            'brand' => $this->brand,
            'last4' => $this->last_four,
            'name' => $this->holder_name,
            'expiry' => $month.'/'.$year,
            'is_default' => (bool) $this->is_default,
        ];
    }
}
