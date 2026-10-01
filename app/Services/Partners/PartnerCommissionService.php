<?php

namespace App\Services\Partners;

use App\Enums\UserRole;
use App\Models\Partner;
use App\Models\User;

class PartnerCommissionService
{
    public function resolveActivePartner(?User $user): ?Partner
    {
        if ($user === null || $user->role !== UserRole::PartnerAdmin) {
            return null;
        }

        return $user->partners()
            ->wherePivot('status', 'active')
            ->where('partners.status', 'active')
            ->orderBy('partners.id')
            ->first();
    }

    /**
     * Fold partner commission into fees/total. Snapshot fields included for persistence.
     *
     * @param  array<string, mixed>  $priced
     * @return array<string, mixed>
     */
    public function apply(array $priced, Partner $partner): array
    {
        $subtotal = round((float) ($priced['subtotal'] ?? 0), 2);
        $tax = round((float) ($priced['tax_amount'] ?? $priced['tax'] ?? 0), 2);
        $fees = round((float) ($priced['fees'] ?? 0), 2);
        $discount = round((float) ($priced['discount'] ?? 0), 2);

        $type = $partner->commission_type === 'flat' ? 'flat' : 'percent';
        $value = round((float) $partner->commission_value, 2);

        $amount = $type === 'flat'
            ? $value
            : round($subtotal * ($value / 100), 2);

        $amount = max(0, $amount);
        $fees = round($fees + $amount, 2);
        $total = round($subtotal + $tax + $fees - $discount, 2);

        $priced['fees'] = $fees;
        $priced['tax_amount'] = $tax;
        $priced['tax'] = $tax;
        $priced['discount'] = $discount;
        $priced['total'] = $total;
        $priced['partner_commission'] = [
            'partner_id' => $partner->id,
            'type' => $type,
            'value' => $value,
            'amount' => $amount,
        ];

        return $priced;
    }
}
