<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\VisitorPass;
use App\Services\VisitorPassWorkflowService;
use Illuminate\Http\Request;
use App\Http\Resources\VisitorPassResource;
use Illuminate\Support\Facades\Auth;

class VisitorPassWorkflowController extends Controller
{
    private VisitorPassWorkflowService $workflowService;

    public function __construct(VisitorPassWorkflowService $workflowService)
    {
        $this->workflowService = $workflowService;
    }

    public function updateStatus(Request $request, VisitorPass $visitorPass)
    {
        $request->validate([
            'status' => 'required|in:awaiting,pending_chef,started,in_progress,accepted,declined',
            'notes' => 'nullable|string|max:1000'
        ]);

        try {
            $updatedPass = $this->workflowService->transition(
                $visitorPass,
                $request->status,
                $request->user(),
                $request->notes
            );

            return new VisitorPassResource($updatedPass);
        } catch (\Exception $e) {
            return response()->json([
                'message' => $e->getMessage()
            ], 403);
        }
    }

    public function getAvailableActions(VisitorPass $visitorPass)
    {
        $user = Auth::user();
        $actions = [];

        // For creating/re-opening
        if ($user->can('create', VisitorPass::class)) {
            if (in_array($visitorPass->status, ['declined', 'accepted'])) {
                $actions[] = [
                    'action' => 'reopen',
                    'available_statuses' => ['awaiting'],
                    'label' => 'Reopen Pass'
                ];
            }
        }

        // For initial submission to chef
        if ($user->can('submit', $visitorPass)) {
            if ($visitorPass->status === 'awaiting') {
                $actions[] = [
                    'action' => 'submit_to_chef',
                    'available_statuses' => ['pending_chef'],
                    'label' => 'Submit to Chef'
                ];
            }
        }

        // For chef approval
        if ($user->can('approve_chef', $visitorPass)) {
            if ($visitorPass->status === 'pending_chef') {
                $actions[] = [
                    'action' => 'approve_as_chef',
                    'available_statuses' => ['started'],
                    'label' => 'Approve as Chef'
                ];
            }
        }

        // For Service des Permis review - now with bypass option
        if ($user->can('review', $visitorPass)) {
            // Normal review for passes at started stage
            if ($visitorPass->status === 'started') {
                $actions[] = [
                    'action' => 'service_permis_review',
                    'available_statuses' => ['in_progress'],
                    'label' => 'Mark as Reviewed'
                ];
            }

            // Bypass chef approval for passes at awaiting or pending_chef stages
            if (in_array($visitorPass->status, ['awaiting', 'pending_chef'])) {
                $actions[] = [
                    'action' => 'bypass_chef',
                    'available_statuses' => ['in_progress'],
                    'label' => 'Bypass Chef & Review'
                ];
            }
        }

        // For Barriere/Gendarmerie final approval
        if ($user->can('approve', $visitorPass)) {
            if ($visitorPass->status === 'in_progress') {
                $actions[] = [
                    'action' => 'final_approve',
                    'available_statuses' => ['accepted'],
                    'label' => 'Final Approval'
                ];
            }
        }

        // For rejection logic - unchanged from your last requirements

        // 1. Pass creator can reject their own pass if not yet fully approved
        if ($user->id === $visitorPass->created_by && !in_array($visitorPass->status, ['accepted', 'declined'])) {
            $actions[] = [
                'action' => 'reject',
                'available_statuses' => ['declined'],
                'label' => 'Cancel My Pass'
            ];
        }

        // 2. Chef from same group as creator can reject
        if ($user->hasRole('chef') && in_array($visitorPass->status, ['awaiting', 'pending_chef'])) {
            // Check if chef is from the same group as creator
            $creator = User::find($visitorPass->created_by);
            if ($creator) {
                $creatorGroups = $creator->groups()->pluck('id')->toArray();
                $chefGroups = $user->groups()->pluck('id')->toArray();

                if (count(array_intersect($creatorGroups, $chefGroups)) > 0) {
                    $actions[] = [
                        'action' => 'reject',
                        'available_statuses' => ['declined'],
                        'label' => 'Reject Pass'
                    ];
                }
            }
        }

        // 3. Service des Permis can reject at started stage or during bypass
        if ($user->can('review', $visitorPass) && in_array($visitorPass->status, ['awaiting', 'pending_chef', 'started'])) {
            $actions[] = [
                'action' => 'reject',
                'available_statuses' => ['declined'],
                'label' => 'Reject Pass'
            ];
        }

        // 4. Barriere/Gendarmerie can reject at in_progress stage
        if ($user->can('approve', $visitorPass) && $visitorPass->status === 'in_progress') {
            $actions[] = [
                'action' => 'reject',
                'available_statuses' => ['declined'],
                'label' => 'Reject Pass'
            ];
        }

        // 5. Admin can reject at any stage
        if ($user->hasRole('admin') && in_array($visitorPass->status, ['awaiting', 'pending_chef', 'started', 'in_progress'])) {
            // Check if reject action is already added
            $hasRejectAction = false;
            foreach ($actions as $action) {
                if ($action['action'] === 'reject') {
                    $hasRejectAction = true;
                    break;
                }
            }

            if (!$hasRejectAction) {
                $actions[] = [
                    'action' => 'reject',
                    'available_statuses' => ['declined'],
                    'label' => 'Reject Pass (Admin)'
                ];
            }
        }

        return response()->json([
            'current_status' => $visitorPass->status,
            'available_actions' => $actions
        ]);
    }

    /**
     * Get workflow history
     */
    public function getWorkflowHistory(VisitorPass $visitorPass)
    {
        $history = $visitorPass->activities()
            ->whereIn('type', ['status_changed', 'status_update'])
            ->with('user:id,display_name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($activity) {
                return [
                    'status' => $activity->metadata['new_status'] ?? $activity->metadata['status'] ?? null,
                    'notes' => $activity->metadata['notes'] ?? null,
                    'user' => $activity->user->display_name,
                    'user_group' => $activity->metadata['user_group'] ?? null,
                    'timestamp' => $activity->created_at,
                    'system_message' => $activity->metadata['system_message'] ?? null
                ];
            });

        return response()->json(['history' => $history]);
    }
}
