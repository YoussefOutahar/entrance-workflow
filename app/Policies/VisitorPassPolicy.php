<?php

namespace App\Policies;

use App\Models\User;
use App\Models\VisitorPass;

class VisitorPassPolicy
{
    public function create(User $user): bool
    {
        return $user->hasGroup('it-department') ||
            $user->hasGroup('hr') ||
            $user->hasGroup('service-permis');
    }

    public function review(User $user, VisitorPass $visitorPass): bool
    {
        // Only chiefs from internal groups can review
        return $user->hasRole('chef') &&
            ($user->hasGroup('it-department') || $user->hasGroup('hr'));
    }

    public function approve(User $user, VisitorPass $visitorPass): bool
    {
        return $user->hasGroup('service-permis');
    }

    public function reject(User $user, VisitorPass $visitorPass): bool
    {
        return $user->hasGroup('gendarmerie') || $user->hasGroup('barriere');
    }

    public function view(User $user, VisitorPass $visitorPass): bool
    {
        return $user->hasAnyGroup(['it-department', 'hr', 'service-permis', 'gendarmerie', 'barriere']);
    }
}
