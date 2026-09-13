<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Requests\Api\RegisterRequest;
use App\Http\Resources\UserResource;
use App\Models\Chauffeur;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();
        $accountType = $data['account_type'];

        $isChauffeur = $accountType === 'chauffeur';
        $isPerson = $accountType === 'individual' || $isChauffeur;

        $user = DB::transaction(function () use ($data, $accountType, $isChauffeur, $isPerson) {
            $user = User::create([
                'name' => User::deriveDisplayName(
                    $accountType,
                    $data['first_name'] ?? null,
                    $data['last_name'] ?? null,
                    $data['company_name'] ?? null,
                    $data['email'],
                ),
                'email' => $data['email'],
                'password' => $data['password'],
                'account_type' => $accountType,
                'title' => $isPerson ? ($data['title'] ?? null) : null,
                'first_name' => $isPerson ? ($data['first_name'] ?? null) : null,
                'last_name' => $isPerson ? ($data['last_name'] ?? null) : null,
                'company_name' => $accountType === 'company' ? ($data['company_name'] ?? null) : null,
                'phone' => $data['phone'],
                'preferred_language' => $data['preferred_language'] ?? null,
                'language' => ! empty($data['preferred_language']) ? $data['preferred_language'] : 'en',
                'street_address' => null,
                'marketing_emails' => true,
                'booking_notifications' => 'email_sms',
                'status' => $isChauffeur ? 'pending' : 'active',
            ]);
            $user->forceFill([
                'role' => $isChauffeur ? UserRole::Chauffeur : UserRole::Customer,
            ])->save();

            if ($isChauffeur) {
                Chauffeur::query()->create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                ]);
            }

            return $user;
        });

        $token = $user->createToken($data['device_name'] ?? 'web')->plainTextToken;

        return response()->json([
            'user' => (new UserResource($user->load('chauffeur')))->resolve(),
            'token' => $token,
            'token_type' => 'Bearer',
            'application_status' => $isChauffeur ? 'pending' : null,
        ], 201);
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::where('email', $data['email'])->first();

        if (! $user || ! Hash::check($data['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->role === UserRole::Chauffeur && $user->chauffeur?->status === 'declined') {
            throw ValidationException::withMessages([
                'email' => ['Your chauffeur application was not approved.'],
            ]);
        }

        $token = $user->createToken($data['device_name'] ?? 'web')->plainTextToken;

        return response()->json([
            'user' => (new UserResource($user->load('chauffeur')))->resolve(),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => (new UserResource($request->user()->load('chauffeur')))->resolve(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}
