<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class VisitorPassResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'visit_date' => $this->visit_date,
            'visited_person' => $this->visited_person,
            'unit' => $this->unit,
            'module' => $this->module,
            'visit_purpose' => $this->visit_purpose,
            'duration_type' => $this->duration_type,
            'duration_days' => $this->duration_days,
            'visitor_name' => $this->visitor_name,
            'id_number' => $this->id_number,
            'organization' => $this->organization,
            'category' => $this->category,
            'status' => $this->status,
            'status_changed_at' => $this->status_changed_at,
            'approved_by' => $this->approved_by,
            'hierarchy_approval' => $this->hierarchy_approval,
            'spp_approval' => $this->spp_approval,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'files' => FileResource::collection($this->whenLoaded('files')),
            'activities' => ActivityResource::collection($this->whenLoaded('activities')),
            'latest_activity' => new ActivityResource($this->activities()->latest()->first()),
        ];
    }
}
