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
        'spp_approval' => 'boolean',
        'status_changed_at' => 'datetime'
    ];

    public function updateStatus(string $newStatus): bool
    {
        $this->status = $newStatus;
        $this->status_changed_at = now();
        return $this->save();
    }

    public function files(): HasMany
    {
        return $this->hasMany(File::class);
    }


    public function activities()
    {
        return $this->morphMany(Activity::class, 'subject');
    }

    public function logStatusChange(string $newStatus, User $user, ?string $notes = null)
    {
        return Activity::logStatusChange($this, $user, [
            'old_status' => $this->getOriginal('status'),
            'new_status' => $newStatus,
            'notes' => $notes
        ]);
    }

    public function logFileUpload(array $fileData, User $user)
    {
        return Activity::logFileUpload($this, $user, $fileData);
    }
}
