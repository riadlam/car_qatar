<?php

namespace App\Http\Controllers\Api\Chauffeur;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChauffeurOfferResource;
use App\Models\RideOffer;
use App\Services\Dispatch\DispatchService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OfferController extends Controller
{
    public function __construct(
        private readonly DispatchService $dispatch,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $chauffeur = $request->user()->chauffeur;

        if ($this->dispatch->hasOngoingTrip($chauffeur)) {
            $this->dispatch->syncChauffeur($chauffeur);

            return response()->json([
                'data' => [],
                'blocked' => true,
                'message' => 'Finish or cancel your current trip before taking another.',
            ]);
        }

        $this->dispatch->ensureOffersFor($chauffeur);

        $min = $request->query('min_payout');
        $max = $request->query('max_payout');

        $offers = RideOffer::query()
            ->where('chauffeur_id', $chauffeur->id)
            ->whereIn('status', ['pending', 'offered'])
            ->whereHas('booking', function ($query) use ($min, $max) {
                if (is_numeric($min) && (float) $min > 0) {
                    $query->where('total_amount', '>=', (float) $min);
                }
                if (is_numeric($max)) {
                    $query->where('total_amount', '<=', (float) $max);
                }
            })
            ->with([
                'booking.pickupLocation',
                'booking.dropoffLocation',
                'booking.vehicleClass',
                'booking.serviceType',
                'booking.guest',
                'booking.user',
                'booking.quote',
            ])
            ->orderByDesc('booking_id')
            ->get();

        return ChauffeurOfferResource::collection($offers)->response();
    }

    public function accept(Request $request, RideOffer $offer): JsonResponse
    {
        $assignment = $this->dispatch->accept($offer, $request->user()->chauffeur);

        return response()->json([
            'message' => 'Offer accepted.',
            'assignment_id' => $assignment->id,
            'booking_id' => $assignment->booking_id,
        ]);
    }

    public function reject(Request $request, RideOffer $offer): JsonResponse
    {
        $this->dispatch->reject($offer, $request->user()->chauffeur);

        return response()->json([
            'message' => 'Offer declined.',
        ]);
    }
}
