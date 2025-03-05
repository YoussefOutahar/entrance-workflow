<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VisitorPass;

class VisitorPassPolicy
{
    public function create(User $user): bool
    {
        // Any user in a group with create permission or admin/chef
        return $this->hasPermission($user, 'create-visitor-pass') ||
            $user->hasRole('admin') ||
            $user->hasRole('chef');
    }

    public function submit(User $user, VisitorPass $visitorPass): bool
    {
        // Any user can submit a pass they created
        return $user->id === $visitorPass->created_by ||
            $this->hasPermission($user, 'create-visitor-pass');
    }

    public function approve_chef(User $user, VisitorPass $visitorPass): bool
    {
        // Admin can always approve
        if ($user->hasRole('admin')) {
            return true;
        }

        // Only chefs can approve at this stage
        if (!$user->hasRole('chef')) {
            return false;
        }

        // Chef must be in the same group as the creator
        $creatorGroups = User::find($visitorPass->created_by)->groups()->pluck('id')->toArray();
        $chefGroups = $user->groups()->pluck('id')->toArray();

        return count(array_intersect($creatorGroups, $chefGroups)) > 0;
    }

    public function review(User $user, VisitorPass $visitorPass): bool
    {
        // Admin can always review
        if ($user->hasRole('admin')) {
            return true;
        }

        // Service des Permis can review passes at started stage or bypass chef approval
        // for passes at awaiting or pending_chef stages
        if ($this->hasPermission($user, 'review-visitor-pass')) {
            return in_array($visitorPass->status, ['awaiting', 'pending_chef', 'started']);
        }

        return false;
    }

    public function approve(User $user, VisitorPass $visitorPass): bool
    {
        // Only Barriere or Gendarmerie can give final approval
        // And only after Service des Permis review (in_progress status)
        return ($visitorPass->status === 'in_progress') &&
            ($this->hasPermission($user, 'approve-visitor-pass') ||
                $user->hasRole('admin'));
    }

    public function reject(User $user, VisitorPass $visitorPass): bool
    {
        // Admin can always reject
        if ($user->hasRole('admin')) {
            return true;
        }

        // Creator can reject their own pass
        if ($user->id === $visitorPass->created_by) {
            return true;
        }

        // Only chef from the same group as the creator can reject
        if ($user->hasRole('chef')) {
            // Get creator's groups
            $creator = User::find($visitorPass->created_by);
            if (!$creator) {
                return false;
            }

            $creatorGroups = $creator->groups()->pluck('id')->toArray();
            $chefGroups = $user->groups()->pluck('id')->toArray();

            // Check if chef is in the same group as creator
            return count(array_intersect($creatorGroups, $chefGroups)) > 0;
        }

        // For Service des Permis and Barriere/Gendarmerie, keep their specific roles
        if ($visitorPass->status === 'started' && $this->hasPermission($user, 'review-visitor-pass')) {
            return true; // Service des Permis can reject at started stage
        }

        if ($visitorPass->status === 'in_progress' && $this->hasPermission($user, 'approve-visitor-pass')) {
            return true; // Barriere/Gendarmerie can reject at in_progress stage
        }

        return false;
    }

    public function view(User $user, VisitorPass $visitorPass): bool
    {
        return $this->hasPermission($user, 'view-all-visitor-passes') ||
            $user->hasRole('admin');
    }

    /**
     * Check if user has a specific permission
     * Admins automatically have all permissions
     */
    private function hasPermission(User $user, string $permission): bool
    {
        // Admins have all permissions
        if ($user->hasRole('admin')) {
            return true;
        }

        // For other users, check if any of their groups have the required permission
        return $user->groups()
            ->whereHas('permissions', function ($query) use ($permission) {
                $query->where('slug', $permission);
            })
            ->exists();
    }
}
