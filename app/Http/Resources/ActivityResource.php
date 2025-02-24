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
            'user' => new UserResource($this->whenLoaded('user')),
            'metadata' => $this->metadata,
            'created_at' => $this->created_at,
            'formatted_date' => $this->created_at->diffForHumans(),
            'subject_type' => $this->subject_type,
            'subject_id' => $this->subject_id,
            'message' => $this->getActivityMessage(),
        ];
    }

    private function getActivityMessage(): string
    {
        return match ($this->type) {
            'pass_created' => 'Created new visitor pass',
            'pass_updated' => 'Updated visitor pass details',
            'pass_deleted' => 'Deleted visitor pass',
            'file_uploaded' => "Uploaded file: {$this->metadata['file_name']}",
            'file_deleted' => "Deleted file: {$this->metadata['file_name']}",
            'status_changed' => "Status changed from {$this->metadata['old_status']} to {$this->metadata['new_status']}",
            default => 'Activity recorded'
        };
    }
}
