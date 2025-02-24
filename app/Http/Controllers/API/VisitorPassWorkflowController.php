<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
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
            'status' => 'required|in:awaiting,declined,started,in_progress,accepted',
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

        if ($user->can('review', $visitorPass)) {
            $actions[] = [
                'action' => 'review',
                'available_statuses' => ['started', 'in_progress'],
                'label' => 'Review Pass'
            ];
        }

        if ($user->can('approve', $visitorPass)) {
            $actions[] = [
                'action' => 'approve',
                'available_statuses' => ['accepted'],
                'label' => 'Approve Pass'
            ];
        }

        if ($user->can('reject', $visitorPass)) {
            $actions[] = [
                'action' => 'reject',
                'available_statuses' => ['declined'],
                'label' => 'Reject Pass'
            ];
        }

        return response()->json([
            'current_status' => $visitorPass->status,
            'available_actions' => $actions
        ]);
    }
}
