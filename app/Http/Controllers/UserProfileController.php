<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class UserProfileController extends Controller
{
    public function show()
    {
        $user = Auth::user()->load(['roles', 'groups.permissions']);
        return response()->json([
            'status' => 'success',
            'data' => [
                'user' => $user
            ]
        ]);
    }

    public function update(Request $request, User $user)
    {
        // Check if the authenticated user is updating their own profile
        if (Auth::id() !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'display_name' => 'required|string|max:255',
            'given_name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'title' => 'nullable|string|max:255',
            'office_phone' => 'nullable|string|max:20',
            'mobile_phone' => 'nullable|string|max:20',
            'office_location' => 'nullable|string|max:255',
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => [
                'user' => $user->refresh()->load(['roles', 'groups'])
            ]
        ]);
    }

    public function changePassword(Request $request, User $user)
    {
        // Check if the authenticated user is changing their own password
        if (Auth::id() !== $user->id) {
            return response()->json([
                'message' => 'Unauthorized'
            ], 403);
        }

        $validated = $request->validate([
            'current_password' => [
                'required',
                function ($attribute, $value, $fail) use ($user) {
                    if (!Hash::check($value, $user->password)) {
                        return $fail(__('The current password is incorrect.'));
                    }
                }
            ],
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols()
            ]
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            'password_last_set' => now()
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Password changed successfully'
        ]);
    }
}
