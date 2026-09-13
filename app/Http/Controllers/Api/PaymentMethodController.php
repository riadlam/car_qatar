<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StorePaymentMethodRequest;
use App\Http\Resources\PaymentMethodResource;
use App\Models\PaymentMethod;
use App\Services\Payments\CardTokenizer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function __construct(
        private readonly CardTokenizer $cards,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', PaymentMethod::class);

        $methods = PaymentMethod::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->orderByDesc('is_default')
            ->orderByDesc('id')
            ->get();

        return response()->json([
            'data' => PaymentMethodResource::collection($methods)->resolve(),
        ]);
    }

    public function store(StorePaymentMethodRequest $request): JsonResponse
    {
        $this->authorize('create', PaymentMethod::class);

        $token = $this->cards->tokenize($request->validated());
        $user = $request->user();
        $isFirst = ! PaymentMethod::query()
            ->where('user_id', $user->id)
            ->where('status', 'active')
            ->exists();

        $method = PaymentMethod::query()->create([
            ...$token,
            'user_id' => $user->id,
            'is_default' => $isFirst,
            'status' => 'active',
        ]);

        return response()->json([
            'data' => (new PaymentMethodResource($method))->resolve(),
        ], 201);
    }

    public function destroy(Request $request, PaymentMethod $paymentMethod): JsonResponse
    {
        $this->authorize('delete', $paymentMethod);

        $paymentMethod->forceFill(['status' => 'removed', 'is_default' => false])->save();

        $next = PaymentMethod::query()
            ->where('user_id', $request->user()->id)
            ->where('status', 'active')
            ->orderByDesc('id')
            ->first();
        if ($next && ! PaymentMethod::query()->where('user_id', $request->user()->id)->where('status', 'active')->where('is_default', true)->exists()) {
            $next->forceFill(['is_default' => true])->save();
        }

        return response()->json([
            'message' => 'Payment method removed.',
        ]);
    }
}
