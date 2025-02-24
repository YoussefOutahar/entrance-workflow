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
        // This is for Service des Permis to review (in_progress status)
        return $this->hasPermission($user, 'review-visitor-pass') ||
            $user->hasRole('admin');
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
        // Any chef can reject
        return $user->hasRole('chef') ||
            $user->hasRole('admin') ||
            $this->hasPermission($user, 'reject-visitor-pass');
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
