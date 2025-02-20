<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class VisitorPass extends Model
{
    protected $fillable = [
        'visit_date',
        'visited_person',
        'unit',
        'module',
        'visit_purpose',
        'duration_type',
        'duration_days',
        'visitor_name',
        'id_number',
        'organization',
        'category',
        'status',
        'approved_by',
        'hierarchy_approval',
        'spp_approval'
    ];

    protected $casts = [
        'visit_date' => 'datetime',
        'duration_days' => 'integer',
        'hierarchy_approval' => 'boolean',
        'spp_approval' => 'boolean'
    ];

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }
}
