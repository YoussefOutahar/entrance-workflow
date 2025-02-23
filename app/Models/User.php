<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Filament\Panel;
use Filament\Models\Contracts\HasName;

class User extends Authenticatable implements MustVerifyEmail, FilamentUser, HasName
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'username',
        'email',
        'password',
        'display_name',
        'is_active',
        'two_factor_secret',
        'two_factor_enabled',
        'email_verified_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_last_set' => 'datetime',
        'account_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'password' => 'hashed',
        'two_factor_enabled' => 'boolean',
    ];

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function hasRole(string $role): bool
    {
        return $this->roles()->where('slug', $role)->exists();
    }

    public function hasAnyRole(array $roles): bool
    {
        return $this->roles()->whereIn('slug', $roles)->exists();
    }

    public function groups(): BelongsToMany
    {
        return $this->belongsToMany(Group::class);
    }

    // Add these helper methods
    public function hasGroup(string $group): bool
    {
        return $this->groups()->where('slug', $group)->exists();
    }

    public function hasAnyGroup(array $groups): bool
    {
        return $this->groups()->whereIn('slug', $groups)->exists();
    }

    public function canAccessPanel(Panel $panel): bool
    {
        \Log::info('User has admin role: ' . $this->hasRole('admin'));
        return $this->hasRole('admin');
    }

    public function getFilamentName(): string
    {
        return $this->display_name ?? $this->username;
    }


    public function activities()
    {
        return $this->hasMany(UserActivity::class);
    }

    public function logActivity($type, $metadata = [])
    {
        return $this->activities()->create([
            'type' => $type,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'metadata' => $metadata,
        ]);
    }
}
