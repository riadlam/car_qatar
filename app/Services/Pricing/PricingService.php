<?php

namespace App\Services\Pricing;

use App\Models\PricingRule;
use App\Models\SeatAddon;
use App\Models\ServiceType;
use App\Models\VehicleClass;
use Illuminate\Support\Collection;
use InvalidArgumentException;

class PricingService
{
    public const TAX_RATE = 0.1525;

    /**
     * @param  array<string, mixed>  $params
     * @return array<string, mixed>
     */
    public function priceTrip(ServiceType $service, VehicleClass $class, array $params = []): array
    {
        $rule = array_key_exists('_pricing_rule', $params)
            ? $params['_pricing_rule']
            : PricingRule::query()
                ->where('service_type_id', $service->id)
                ->where('vehicle_class_id', $class->id)
                ->where('status', 'active')
                ->orderByDesc('priority')
                ->first();

        if (! $rule) {
            throw new InvalidArgumentException(
                "No active pricing rule for service [{$service->slug}] and class [{$class->slug}]."
            );
        }

        $items = [];
        $isHourly = $service->is_hourly || $service->mode === 'hourly';
        $distanceKm = isset($params['distance_km']) ? (float) $params['distance_km'] : null;
        $routeMinutes = isset($params['route_duration_minutes']) ? (int) $params['route_duration_minutes'] : null;

        if ($isHourly) {
            $hours = $this->resolveHours($params);
            $unitPrice = (float) ($rule->hourly_price ?? $rule->base_price);
            $amount = round($unitPrice * $hours, 2);

            $items[] = [
                'item_type' => 'hourly',
                'name' => $class->name.' — '.$service->name,
                'quantity' => $hours,
                'unit_price' => round($unitPrice, 2),
                'total_price' => $amount,
                'metadata' => [
                    'hours' => $hours,
                ],
            ];
        } else {
            // Simple client model: Starting fee + distance × price per km
            $km = max(0, (float) ($distanceKm ?? 0));
            $startingFee = (float) $rule->base_price;
            $unitPrice = round($startingFee + ($km * (float) $rule->per_km), 2);
            $factor = $this->schoolTermMultiplier($service, $params);
            $amount = round($unitPrice * $factor, 2);

            $items[] = [
                'item_type' => 'transfer',
                'name' => $class->name.' — '.$service->name,
                'quantity' => $factor,
                'unit_price' => $unitPrice,
                'total_price' => $amount,
                'metadata' => [
                    'distance_km' => $km,
                    'starting_fee' => $startingFee,
                    'per_km' => (float) $rule->per_km,
                    'duration_minutes' => $routeMinutes,
                    'school_term' => $params['school_term'] ?? null,
                    'term_multiplier' => $factor,
                ],
            ];
        }

        $subtotal = $amount;

        $seatAddon = array_key_exists('_seat_addon', $params)
            ? $params['_seat_addon']
            : $this->resolveSeatAddon($params);
        if ($seatAddon && $seatAddon->slug !== 'none') {
            $addonPrice = round((float) $seatAddon->default_price, 2);
            if ($addonPrice > 0) {
                $subtotal = round($subtotal + $addonPrice, 2);
                $items[] = [
                    'item_type' => 'seat_addon',
                    'name' => $seatAddon->label,
                    'quantity' => 1,
                    'unit_price' => $addonPrice,
                    'total_price' => $addonPrice,
                    'metadata' => [
                        'seat_addon_id' => $seatAddon->id,
                        'slug' => $seatAddon->slug,
                    ],
                ];
            }
        }

        $taxRate = $this->taxRate($rule);
        $tax = round($subtotal * $taxRate, 2);
        $fees = 0.0;
        $discount = 0.0;
        $total = round($subtotal + $tax + $fees - $discount, 2);

        return [
            'currency' => $rule->currency ?: 'USD',
            'subtotal' => $subtotal,
            'tax_amount' => $tax,
            'tax' => $tax,
            'fees' => $fees,
            'discount' => $discount,
            'total' => $total,
            'pricing_rule_id' => $rule->id,
            'vehicle_class_id' => $class->id,
            'distance_km' => $distanceKm,
            'route_duration_minutes' => $routeMinutes,
            'items' => $items,
        ];
    }

    /**
     * @param  array<string, mixed>  $params
     * @return list<array<string, mixed>>
     */
    public function priceAllClasses(ServiceType $service, array $params = []): array
    {
        /** @var Collection<int, VehicleClass> $classes */
        $classes = VehicleClass::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        $rules = PricingRule::query()
            ->where('service_type_id', $service->id)
            ->where('status', 'active')
            ->orderBy('priority')
            ->get()
            ->keyBy('vehicle_class_id');
        $params['_seat_addon'] = $this->resolveSeatAddon($params);

        $options = [];

        foreach ($classes as $class) {
            $params['_pricing_rule'] = $rules->get($class->id);
            try {
                $priced = $this->priceTrip($service, $class, $params);
            } catch (InvalidArgumentException) {
                continue;
            }

            $options[] = array_merge($priced, [
                'vehicle_class' => $class,
            ]);
        }

        return $options;
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function resolveHours(array $params): float
    {
        if (! empty($params['duration_minutes']) && empty($params['duration']) && empty($params['route_duration_minutes'])) {
            return max(1, ((float) $params['duration_minutes']) / 60);
        }

        $duration = $params['duration'] ?? null;

        if ($duration === 'full_day' || $duration === 'full-day') {
            return 12.0;
        }

        if (is_numeric($duration) && (float) $duration > 0) {
            return (float) $duration;
        }

        if (! empty($params['duration_minutes'])) {
            return max(1, ((float) $params['duration_minutes']) / 60);
        }

        return 1.0;
    }

    /**
     * One semester uses the rule as-is. A full school year doubles it.
     *
     * @param  array<string, mixed>  $params
     */
    private function schoolTermMultiplier(ServiceType $service, array $params): float
    {
        if ($service->slug !== 'school_chauffeured' && ! $service->requires_school_term) {
            return 1.0;
        }

        $term = strtolower(str_replace([' ', '-'], '_', (string) ($params['school_term'] ?? '')));

        if (in_array($term, ['two_semesters', 'two_semester', '2', 'school_year'], true)) {
            return 2.0;
        }

        return 1.0;
    }

    private function taxRate(PricingRule $rule): float
    {
        if ($rule->tax_rate === null) {
            return self::TAX_RATE;
        }

        $rate = (float) $rule->tax_rate;

        return $rate > 1 ? $rate / 100 : $rate;
    }

    /**
     * @param  array<string, mixed>  $params
     */
    private function resolveSeatAddon(array $params): ?SeatAddon
    {
        if (! empty($params['seat_addon_id'])) {
            return SeatAddon::query()->find($params['seat_addon_id']);
        }

        if (! empty($params['seat_addon'])) {
            return SeatAddon::query()
                ->where('slug', $params['seat_addon'])
                ->where('status', 'active')
                ->first();
        }

        if (! empty($params['seat_addon_slug'])) {
            return SeatAddon::query()
                ->where('slug', $params['seat_addon_slug'])
                ->where('status', 'active')
                ->first();
        }

        return null;
    }
}
