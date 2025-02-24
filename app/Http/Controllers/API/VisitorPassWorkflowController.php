<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\VisitorPass;
use Illuminate\Http\Request;
use App\Http\Resources\VisitorPassResource;
use Illuminate\Support\Facades\Auth;

class VisitorPassWorkflowController extends Controller
{
    /**
     * Update the pass status
     */
    public function updateStatus(Request $request, VisitorPass $visitorPass)
    {
        $request->validate([
            'status' => 'required|in:awaiting,declined,started,in_progress,accepted',
            'notes' => 'nullable|string'
        ]);

        // Check if user has permission to update status
        if (!$this->canUpdateStatus($request->user(), $visitorPass, $request->status)) {
            return response()->json([
                'message' => 'Unauthorized to perform this action'
            ], 403);
        }

        $visitorPass->updateStatus($request->status);

        // Add to audit log
        $visitorPass->logActivity([
            'action' => 'status_update',
            'status' => $request->status,
            'notes' => $request->notes,
            'user_id' => Auth::id()
        ]);

        return new VisitorPassResource($visitorPass);
    }

    /**
     * Get available actions for current pass
     */
    public function getAvailableActions(VisitorPass $visitorPass)
    {
        $user = Auth::user();
        $availableActions = [];

        // Define possible transitions based on current status
        $transitions = [
            'awaiting' => ['started', 'declined'],
            'started' => ['in_progress', 'declined'],
            'in_progress' => ['accepted', 'declined'],
            'declined' => ['awaiting'],
            'accepted' => ['awaiting'] // Allow reopening if needed
        ];

        // Get possible next states
        $nextStates = $transitions[$visitorPass->status] ?? [];

        // Check permissions for each possible transition
        foreach ($nextStates as $state) {
            if ($this->canUpdateStatus($user, $visitorPass, $state)) {
                $availableActions[] = [
                    'action' => $state,
                    'label' => ucfirst($state)
                ];
            }
        }

        return response()->json([
            'current_status' => $visitorPass->status,
            'available_actions' => $availableActions
        ]);
    }

    /**
     * Get workflow history
     */
    public function getWorkflowHistory(VisitorPass $visitorPass)
    {
        $history = $visitorPass->activities()
            ->where('type', 'status_update')
            ->with('user:id,display_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($activity) {
                return [
                    'status' => $activity->metadata['status'],
                    'notes' => $activity->metadata['notes'] ?? null,
                    'user' => $activity->user->display_name,
                    'timestamp' => $activity->created_at
                ];
            });

        return response()->json(['history' => $history]);
    }

    /**
     * Check if user can update to specific status
     */
    private function canUpdateStatus($user, VisitorPass $visitorPass, string $newStatus): bool
    {
        // Define permission requirements for each status transition
        $requiredPermissions = [
            'started' => ['review-visitor-pass'],
            'in_progress' => ['review-visitor-pass'],
            'accepted' => ['approve-visitor-pass'],
            'declined' => ['reject-visitor-pass'],
            'awaiting' => ['create-visitor-pass']
        ];

        // Get required permissions for this status
        $permissions = $requiredPermissions[$newStatus] ?? [];

        // Check if user has any of the required permissions through their groups
        return $user->groups()
            ->whereHas('permissions', function ($query) use ($permissions) {
                $query->whereIn('slug', $permissions);
            })->exists();
    }
}
