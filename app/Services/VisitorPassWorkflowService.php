<?php

namespace App\Services;

use App\Models\VisitorPass;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\DB;
use Illuminate\Auth\Access\AuthorizationException;

class VisitorPassWorkflowService
{
    // Update transitions to enforce the correct workflow
    private array $allowedTransitions = [
        'awaiting' => ['pending_chef', 'started', 'in_progress', 'declined'],  // Admin/chef can go straight to started
        'pending_chef' => ['started', 'in_progress', 'declined'],              // Chef approval to Service des Permis
        'started' => ['in_progress', 'declined'],               // Service des Permis reviewing
        'in_progress' => ['accepted', 'declined'],              // Ready for Gendarmerie/Barrière approval
        'accepted' => ['awaiting'],                             // Reset if needed
        'declined' => ['awaiting']                              // Reset if needed
    ];

    private array $transitionMessages = [
        'pending_chef' => 'Pass submitted for chef approval',
        'started' => 'Pass approved by chef and sent to Service des Permis',
        'in_progress' => 'Pass reviewed by Service des Permis and ready for final approval',
        'accepted' => 'Pass approved by Barriere/Gendarmerie',
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

            // Special case: Allow direct approval for admin/chef
            $bypassCheck = false;
            if (
                $visitorPass->status === 'awaiting' && $newStatus === 'started' &&
                ($user->hasRole('admin') || $user->hasRole('chef'))
            ) {
                $bypassCheck = true;
            }

            // Special case: Allow Service des Permis to bypass chef
            if (
                in_array($visitorPass->status, ['awaiting', 'pending_chef']) &&
                $newStatus === 'in_progress' &&
                $user->can('review', $visitorPass)
            ) {
                $bypassCheck = true;

                // Set custom message for this bypass
                $this->transitionMessages[$newStatus] = 'Pass directly reviewed by Service des Permis (chef approval bypassed)';
            }

            if (!$bypassCheck && !$this->userCanTransition($user, $visitorPass, $newStatus)) {
                throw new AuthorizationException("User not authorized for this transition");
            }

            $oldStatus = $visitorPass->status;
            $visitorPass->updateStatus($newStatus);

            // If approved, record who approved it
            if ($newStatus === 'accepted') {
                $visitorPass->approved_by = $user->id;
                $visitorPass->save();
            }

            // For the bypass case, add a specific transition type
            $transitionType = $this->getTransitionType($oldStatus, $newStatus);
            if (in_array($oldStatus, ['awaiting', 'pending_chef']) && $newStatus === 'in_progress') {
                $transitionType = 'chef_bypass_service_review';
            }

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
                    'transition_type' => $transitionType,
                    'system_message' => $this->transitionMessages[$newStatus],
                    'changed_at' => now()->toIso8601String(),
                    'user_group' => $user->groups()->first() ? $user->groups()->first()->name : null
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
        // Admin can do any transition
        if ($user->hasRole('admin')) {
            return true;
        }

        // Chef can directly approve to started
        if ($user->hasRole('chef') && $visitorPass->status === 'awaiting' && $newStatus === 'started') {
            return true;
        }

        // Service des Permis bypass: can go from awaiting/pending_chef directly to in_progress
        if (
            in_array($visitorPass->status, ['awaiting', 'pending_chef']) &&
            $newStatus === 'in_progress' &&
            $user->can('review', $visitorPass)
        ) {
            return true;
        }

        // For rejection, check specific permissions - unchanged from previous version
        if ($newStatus === 'declined') {
            // Creator can always reject their own pass if not yet fully approved
            if ($user->id === $visitorPass->created_by && !in_array($visitorPass->status, ['accepted', 'declined'])) {
                return true;
            }

            // Chef from the same group as creator can reject
            if ($user->hasRole('chef') && in_array($visitorPass->status, ['awaiting', 'pending_chef'])) {
                $creator = User::find($visitorPass->created_by);
                if (!$creator) {
                    return false;
                }

                $creatorGroups = $creator->groups()->pluck('id')->toArray();
                $chefGroups = $user->groups()->pluck('id')->toArray();

                return count(array_intersect($creatorGroups, $chefGroups)) > 0;
            }

            // Service des Permis can reject at started stage or bypass stages
            if (in_array($visitorPass->status, ['awaiting', 'pending_chef', 'started']) && $user->can('review', $visitorPass)) {
                return true;
            }

            // Barriere/Gendarmerie can reject at in_progress stage
            if ($visitorPass->status === 'in_progress' && $user->can('approve', $visitorPass)) {
                return true;
            }

            return false;
        }

        // Other transitions remain unchanged
        return match ($newStatus) {
            'pending_chef' => $user->can('submit', $visitorPass),
            'started' => $user->can('approve_chef', $visitorPass),
            'in_progress' => $user->can('review', $visitorPass), // Service des Permis review
            'accepted' => $user->can('approve', $visitorPass),   // Gendarmerie/Barrière approval
            'awaiting' => $user->can('create', $visitorPass),
            default => false
        };
    }

    private function getTransitionType(string $oldStatus, string $newStatus): string
    {
        // Handle Service des Permis bypass case
        if (in_array($oldStatus, ['awaiting', 'pending_chef']) && $newStatus === 'in_progress') {
            return 'chef_bypass_service_review';
        }

        return match ($newStatus) {
            'pending_chef' => 'submitted_to_chef',
            'started' => 'chef_approved',
            'in_progress' => 'service_review',
            'accepted' => 'final_approval',
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
