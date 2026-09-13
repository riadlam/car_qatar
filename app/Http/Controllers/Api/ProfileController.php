<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\DeleteAccountRequest;
use App\Http\Requests\Api\UpdateEmailRequest;
use App\Http\Requests\Api\UpdatePasswordRequest;
use App\Http\Requests\Api\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class ProfileController extends Controller
{
    public function update(UpdateProfileRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $data = $request->validated();

        unset($data['company']);

        if (array_key_exists('company_name', $data) || array_key_exists('first_name', $data) || array_key_exists('last_name', $data) || array_key_exists('account_type', $data)) {
            $accountType = $data['account_type'] ?? $user->account_type;
            $firstName = array_key_exists('first_name', $data) ? $data['first_name'] : $user->first_name;
            $lastName = array_key_exists('last_name', $data) ? $data['last_name'] : $user->last_name;
            $companyName = array_key_exists('company_name', $data) ? $data['company_name'] : $user->company_name;

            $data['name'] = User::deriveDisplayName(
                $accountType,
                $firstName,
                $lastName,
                $companyName,
                $user->email,
            );

            if ($accountType === 'company') {
                $data['title'] = null;
                $data['first_name'] = null;
                $data['last_name'] = null;
            } else {
                $data['company_name'] = null;
            }
        }

        $user->fill($data);
        $user->save();

        return response()->json([
            'user' => (new UserResource($user->fresh()))->resolve(),
        ]);
    }

    public function updateEmail(UpdateEmailRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->email = $request->validated('email');
        $user->email_verified_at = null;
        $user->save();

        return response()->json([
            'user' => (new UserResource($user->fresh()))->resolve(),
        ]);
    }

    public function updatePassword(UpdatePasswordRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();
        $user->password = $request->validated('password');
        $user->save();

        $user->tokens()->delete();

        $token = $user->createToken($request->input('device_name', 'web'))->plainTextToken;

        return response()->json([
            'message' => 'Password updated successfully.',
            'user' => (new UserResource($user->fresh()))->resolve(),
            'token' => $token,
            'token_type' => 'Bearer',
        ]);
    }

    public function destroy(DeleteAccountRequest $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        $user->tokens()->delete();
        $user->delete();

        return response()->json([
            'message' => 'Account deleted successfully.',
        ]);
    }
}
