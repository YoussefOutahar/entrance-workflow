<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ActivityResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        $messageMap = [
            'status_changed' => $this->getStatusChangeMessage(),
            'file_uploaded' => $this->getFileUploadMessage(),
            'pass_created' => 'Pass created',
            'pass_updated' => 'Pass information updated',
            'pass_deleted' => 'Pass deleted',
            'comment' => 'Added a comment'
        ];

        return [
            'id' => $this->id,
            'type' => $this->type,
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->display_name,
                'username' => $this->user->username
            ],
            'metadata' => $this->metadata,
            'message' => $messageMap[$this->type] ?? 'Activity recorded',
            'created_at' => $this->created_at,
            'formatted_date' => $this->created_at->diffForHumans()
        ];
    }

    private function getStatusChangeMessage(): string
    {
        $statusLabels = [
            'awaiting' => 'Awaiting Submission',
            'pending_chef' => 'Pending Chef Approval',
            'started' => 'Service des Permis Review',
            'in_progress' => 'Ready for Final Approval',
            'accepted' => 'Approved',
            'declined' => 'Rejected'
        ];

        $oldStatus = $this->metadata['old_status'] ?? 'unknown';
        $newStatus = $this->metadata['new_status'] ?? 'unknown';

        $oldLabel = $statusLabels[$oldStatus] ?? ucfirst($oldStatus);
        $newLabel = $statusLabels[$newStatus] ?? ucfirst($newStatus);

        return "Status changed from {$oldLabel} to {$newLabel}";
    }

    private function getFileUploadMessage(): string
    {
        $fileName = $this->metadata['file_name'] ?? 'a file';
        return "Uploaded {$fileName}";
    }
}
