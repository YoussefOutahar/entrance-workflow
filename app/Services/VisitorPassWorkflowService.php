<?php

namespace App\Services;

use App\Models\VisitorPass;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;

class VisitorPassWorkflowService
{
    private array $allowedTransitions = [
        'awaiting' => ['started', 'declined'],
        'started' => ['in_progress', 'declined'],
        'in_progress' => ['accepted', 'declined'],
        'declined' => ['awaiting'],
        'accepted' => ['awaiting']
    ];

    private array $transitionMessages = [
        'started' => 'Review process initiated',
        'in_progress' => 'Review in progress',
        'accepted' => 'Pass approved',
        'declined' => 'Pass rejected',
        'awaiting' => 'Pass returned to awaiting state'
    ];

    public function transition(VisitorPass $visitorPass, string $newStatus, User $user, ?string $notes = null): VisitorPass
    {
        try {
            DB::beginTransaction();

            if (!$this->isValidTransition($visitorPass->status, $newStatus)) {
                throw new \InvalidArgumentException(
                    "Invalid status transition from {$visitorPass->status} to {$newStatus}"
                );
            }

            if (!$this->userCanTransition($user, $visitorPass, $newStatus)) {
                throw new AuthorizationException("User not authorized for this transition");
            }

            $oldStatus = $visitorPass->status;
            $visitorPass->updateStatus($newStatus);

            // Log status change activity
            Activity::create([
                'subject_type' => get_class($visitorPass),
                'subject_id' => $visitorPass->id,
                'type' => 'status_changed',
                'user_id' => $user->id,
                'metadata' => [
                    'old_status' => $oldStatus,
                    'new_status' => $newStatus,
                    'notes' => $notes,
                    'transition_type' => $this->getTransitionType($oldStatus, $newStatus),
                    'system_message' => $this->transitionMessages[$newStatus],
                    'changed_at' => now()->toIso8601String()
                ]
            ]);

            DB::commit();
            return $visitorPass->fresh();

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in status transition:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    private function isValidTransition(string $currentStatus, string $newStatus): bool
    {
        return isset($this->allowedTransitions[$currentStatus]) &&
            in_array($newStatus, $this->allowedTransitions[$currentStatus]);
    }

    private function userCanTransition(User $user, VisitorPass $visitorPass, string $newStatus): bool
    {
        return match ($newStatus) {
            'started', 'in_progress' => $user->can('review', $visitorPass),
            'accepted' => $user->can('approve', $visitorPass),
            'declined' => $user->can('reject', $visitorPass),
            'awaiting' => $user->can('create', $visitorPass),
            default => false
        };
    }

    private function getTransitionType(string $oldStatus, string $newStatus): string
    {
        return match ($newStatus) {
            'started' => 'review_started',
            'in_progress' => 'review_in_progress',
            'accepted' => 'approval',
            'declined' => 'rejection',
            'awaiting' => 'reopened',
            default => 'status_change'
        };
    }

    public function getAvailableTransitions(string $currentStatus): array
    {
        return $this->allowedTransitions[$currentStatus] ?? [];
    }
}
