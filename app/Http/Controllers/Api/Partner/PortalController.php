<?php

namespace App\Http\Controllers\Api\Partner;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Partner;
use App\Models\PartnerPayout;
use App\Services\Partners\BookingPaymentLinkService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PortalController extends Controller
{
    public function __construct(
        private readonly BookingPaymentLinkService $paymentLinks,
    ) {}

    public function me(Request $request): JsonResponse
    {
        /** @var Partner $partner */
        $partner = $request->attributes->get('partner');

        return response()->json([
            'data' => [
                'id' => $partner->id,
                'display_name' => $partner->display_name,
                'legal_name' => $partner->legal_name,
                'email' => $partner->email,
                'phone' => $partner->phone,
                'commission_type' => $partner->commission_type,
                'commission_value' => (float) $partner->commission_value,
                'status' => $partner->status,
                'earned_total' => $partner->earnedCommissionTotal(),
                'paid_total' => $partner->paidOutTotal(),
                'unpaid_balance' => $partner->unpaidBalance(),
                'completed_rides' => $partner->bookings()
                    ->where('partner_commission_status', 'earned')
                    ->count(),
            ],
        ]);
    }

    public function bookings(Request $request): JsonResponse
    {
        /** @var Partner $partner */
        $partner = $request->attributes->get('partner');

        $rows = Booking::query()
            ->where('partner_id', $partner->id)
            ->with(['guest', 'pickupLocation', 'dropoffLocation', 'vehicleClass', 'serviceType', 'paymentLinks'])
            ->orderByDesc('pickup_at')
            ->paginate(20);

        $data = $rows->getCollection()->map(function (Booking $booking) {
            $activeLink = $booking->paymentLinks
                ->filter(fn ($l) => $l->isUsable())
                ->sortByDesc('id')
                ->first();

            return [
                'id' => $booking->id,
                'booking_number' => $booking->booking_number,
                'status' => $booking->status?->value ?? $booking->status,
                'payment_status' => $booking->payment_status?->value ?? $booking->payment_status,
                'pickup_at' => $booking->pickup_at,
                'currency' => $booking->currency,
                'total_amount' => (float) $booking->total_amount,
                'partner_commission_amount' => (float) ($booking->partner_commission_amount ?? 0),
                'partner_commission_status' => $booking->partner_commission_status,
                'guest' => $booking->guest ? [
                    'name' => trim($booking->guest->first_name.' '.$booking->guest->last_name),
                    'email' => $booking->guest->email,
                    'phone' => $booking->guest->phone,
                ] : null,
                'pickup' => $booking->pickupLocation?->formatted_address,
                'dropoff' => $booking->dropoffLocation?->formatted_address,
                'vehicle_class' => $booking->vehicleClass?->name,
                'service_type' => $booking->serviceType?->name,
                'payment_link' => $activeLink ? [
                    'url' => $this->paymentLinks->publicUrl($activeLink),
                    'expires_at' => $activeLink->expires_at?->toIso8601String(),
                ] : null,
            ];
        });

        return response()->json([
            'data' => $data,
            'meta' => [
                'current_page' => $rows->currentPage(),
                'last_page' => $rows->lastPage(),
                'per_page' => $rows->perPage(),
                'total' => $rows->total(),
            ],
        ]);
    }

    public function earnings(Request $request): JsonResponse
    {
        /** @var Partner $partner */
        $partner = $request->attributes->get('partner');

        $earned = Booking::query()
            ->where('partner_id', $partner->id)
            ->where('partner_commission_status', 'earned')
            ->with(['guest'])
            ->orderByDesc('completed_at')
            ->limit(100)
            ->get()
            ->map(fn (Booking $b) => [
                'type' => 'earning',
                'booking_id' => $b->id,
                'booking_number' => $b->booking_number,
                'amount' => (float) $b->partner_commission_amount,
                'currency' => $b->currency,
                'at' => $b->completed_at,
                'guest' => $b->guest
                    ? trim($b->guest->first_name.' '.$b->guest->last_name)
                    : null,
            ]);

        $payouts = PartnerPayout::query()
            ->where('partner_id', $partner->id)
            ->where('status', 'paid')
            ->orderByDesc('paid_at')
            ->limit(100)
            ->get()
            ->map(fn (PartnerPayout $p) => [
                'type' => 'payout',
                'id' => $p->id,
                'amount' => (float) $p->amount,
                'currency' => $p->currency,
                'at' => $p->paid_at,
                'note' => $p->note,
            ]);

        return response()->json([
            'data' => [
                'earned_total' => $partner->earnedCommissionTotal(),
                'paid_total' => $partner->paidOutTotal(),
                'unpaid_balance' => $partner->unpaidBalance(),
                'lines' => $earned->concat($payouts)
                    ->sortByDesc(fn ($row) => $row['at'] ?? '')
                    ->values(),
            ],
        ]);
    }

    public function refreshPaymentLink(Request $request, Booking $booking): JsonResponse
    {
        /** @var Partner $partner */
        $partner = $request->attributes->get('partner');

        if ((int) $booking->partner_id !== (int) $partner->id) {
            abort(404);
        }

        if ($booking->status->value !== 'pending_payment') {
            return response()->json([
                'message' => 'Payment link is only available while the booking awaits guest payment.',
            ], 422);
        }

        $link = $this->paymentLinks->mint($booking);

        return response()->json([
            'data' => [
                'url' => $this->paymentLinks->publicUrl($link),
                'expires_at' => $link->expires_at?->toIso8601String(),
            ],
        ]);
    }
}
