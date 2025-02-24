<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'type' => $this->type,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->display_name,
                'username' => $this->user->username
            ],
            'metadata' => $this->metadata,
            'created_at' => $this->created_at->toIso8601String(),
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'subject' => $this->when($this->subject, function () {
                return [
                    'id' => $this->subject->id,
                    'type' => class_basename($this->subject_type),
                    // Add other relevant subject details
                ];
            })
        ];
    }
}
