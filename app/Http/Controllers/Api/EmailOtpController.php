<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\SendEmailOtpRequest;
use App\Http\Requests\Api\VerifyEmailOtpRequest;
use App\Services\Auth\EmailOtpService;
use Illuminate\Http\JsonResponse;

class EmailOtpController extends Controller
{
    public function __construct(
        private readonly EmailOtpService $otp,
    ) {}

    public function send(SendEmailOtpRequest $request): JsonResponse
    {
        $result = $this->otp->send($request->validated('email'), isResend: false);

        return response()->json([
            'message' => __('api.auth.otp_sent'),
            'cooldown_seconds' => $result['cooldown_seconds'],
            'expires_in' => $result['expires_in'],
        ]);
    }

    public function resend(SendEmailOtpRequest $request): JsonResponse
    {
        $result = $this->otp->send($request->validated('email'), isResend: true);

        return response()->json([
            'message' => __('api.auth.otp_resent'),
            'cooldown_seconds' => $result['cooldown_seconds'],
            'expires_in' => $result['expires_in'],
        ]);
    }

    public function verify(VerifyEmailOtpRequest $request): JsonResponse
    {
        $data = $request->validated();
        $result = $this->otp->verify($data['email'], $data['code']);

        return response()->json([
            'message' => __('api.auth.otp_verified'),
            'email_otp_token' => $result['email_otp_token'],
            'expires_in' => $result['expires_in'],
        ]);
    }
}
