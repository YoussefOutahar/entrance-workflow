<?php

namespace App\Providers;

use App\Models\VisitorPass;
use App\Policies\VisitorPassPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        VisitorPass::class => VisitorPassPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}
