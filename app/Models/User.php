<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'username',
        'email',
        'password',
        'display_name',
        'given_name',
        'surname',
        'initials',
        'employee_id',
        'company',
        'department',
        'title',
        'manager_id',
        'office_phone',
        'mobile_phone',
        'office_location',
        'street_address',
        'city',
        'state',
        'postal_code',
        'country',
        'is_active',
        'guid',
        'distinguished_name',
        'group_memberships',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'guid',
        'distinguished_name',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password_last_set' => 'datetime',
        'account_expires_at' => 'datetime',
        'is_active' => 'boolean',
        'group_memberships' => 'array',
        'password' => 'hashed',
    ];

    public function manager()
    {
        return $this->belongsTo(User::class, 'manager_id');
    }

    public function subordinates()
    {
        return $this->hasMany(User::class, 'manager_id');
    }
}
