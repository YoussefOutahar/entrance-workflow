<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorAuthController extends Controller
{
    protected $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    public function enable(Request $request): JsonResponse
    {
        $secret = $this->google2fa->generateSecretKey();

        $request->user()->update([
            'two_factor_secret' => $secret,
            'two_factor_enabled' => false,
        ]);

        return response()->json([
            'secret' => $secret,
            'qr_code' => $this->google2fa->getQRCodeUrl(
                config('app.name'),
                $request->user()->email,
                $secret
            ),
        ]);
    }

    public function confirm(Request $request): JsonResponse
    {
        $request->validate(['code' => 'required|string']);

        $valid = $this->google2fa->verifyKey(
            $request->user()->two_factor_secret,
            $request->code
        );

        if ($valid) {
            $request->user()->update(['two_factor_enabled' => true]);
            return response()->json(['message' => '2FA enabled successfully']);
        }

        return response()->json(['message' => 'Invalid code'], 422);
    }

    public function disable(Request $request): JsonResponse
    {
        $request->user()->update([
            'two_factor_secret' => null,
            'two_factor_enabled' => false,
        ]);

        return response()->json(['message' => '2FA disabled successfully']);
    }
}
