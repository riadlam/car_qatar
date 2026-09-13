<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ContactChannelResource;
use App\Http\Resources\ExplorePlaceResource;
use App\Http\Resources\GulfDestinationResource;
use App\Http\Resources\SchoolTermResource;
use App\Http\Resources\SeatAddonResource;
use App\Http\Resources\ServiceTypeResource;
use App\Http\Resources\VehicleClassResource;
use App\Models\ContactChannel;
use App\Models\ExplorePlace;
use App\Models\GulfDestination;
use App\Models\SchoolTerm;
use App\Models\SeatAddon;
use App\Models\ServiceType;
use App\Models\VehicleClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CatalogController extends Controller
{
    public function serviceTypes(): JsonResponse
    {
        $types = ServiceType::query()
            ->where('status', 'active')
            ->with([
                'durationOptions' => fn ($q) => $q->where('status', 'active')->orderBy('sort_order'),
                'countOptions' => fn ($q) => $q->where('status', 'active')->orderBy('sort_order'),
            ])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => ServiceTypeResource::collection($types)->resolve(),
        ]);
    }

    public function vehicleClasses(): JsonResponse
    {
        $classes = VehicleClass::query()
            ->where('status', 'active')
            ->with([
                'amenities' => fn ($q) => $q->orderBy('sort_order'),
                'media' => fn ($q) => $q->orderBy('sort_order'),
            ])
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => VehicleClassResource::collection($classes)->resolve(),
        ]);
    }

    public function seatAddons(): JsonResponse
    {
        $addons = SeatAddon::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => SeatAddonResource::collection($addons)->resolve(),
        ]);
    }

    public function gulfDestinations(): JsonResponse
    {
        $destinations = GulfDestination::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => GulfDestinationResource::collection($destinations)->resolve(),
        ]);
    }

    public function schoolTerms(): JsonResponse
    {
        $terms = SchoolTerm::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => SchoolTermResource::collection($terms)->resolve(),
        ]);
    }

    public function contactChannels(): JsonResponse
    {
        $channels = ContactChannel::query()
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get();

        return response()->json([
            'data' => ContactChannelResource::collection($channels)->resolve(),
        ]);
    }

    public function explorePlaces(Request $request): JsonResponse
    {
        $category = $request->string('category')->toString();
        $allowed = ['hotel', 'beach', 'mall', 'restaurant', 'iconic'];

        $query = ExplorePlace::query()->active()->ordered();
        if ($category !== '' && in_array($category, $allowed, true)) {
            $query->forCategory($category);
        }

        return response()->json([
            'data' => ExplorePlaceResource::collection($query->get())->resolve(),
        ]);
    }
}
