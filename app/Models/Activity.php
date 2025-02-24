<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Activity extends Model
{
    protected $fillable = [
        'subject_type',
        'subject_id',
        'type',
        'user_id',
        'metadata'
    ];

    protected $casts = [
        'metadata' => 'array',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    // Relationships
    public function subject(): MorphTo
    {
        return $this->morphTo();
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Helper methods for activity types
    public static function logStatusChange(Model $subject, User $user, array $data): self
    {
        return self::create([
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'type' => 'status_change',
            'user_id' => $user->id,
            'metadata' => [
                'old_status' => $data['old_status'] ?? null,
                'new_status' => $data['new_status'],
                'notes' => $data['notes'] ?? null,
                'timestamp' => now()->toIso8601String()
            ]
        ]);
    }

    public static function logFileUpload(Model $subject, User $user, array $fileData): self
    {
        return self::create([
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'type' => 'file_upload',
            'user_id' => $user->id,
            'metadata' => [
                'file_name' => $fileData['name'],
                'file_size' => $fileData['size'],
                'file_type' => $fileData['type'],
                'timestamp' => now()->toIso8601String()
            ]
        ]);
    }

    public static function logComment(Model $subject, User $user, string $comment): self
    {
        return self::create([
            'subject_type' => get_class($subject),
            'subject_id' => $subject->id,
            'type' => 'comment',
            'user_id' => $user->id,
            'metadata' => [
                'comment' => $comment,
                'timestamp' => now()->toIso8601String()
            ]
        ]);
    }
}
