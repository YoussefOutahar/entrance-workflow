<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\VisitorPass;
use Illuminate\Http\Request;
use App\Http\Resources\ActivityResource;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ActivityController extends Controller
{
    public function index(Request $request): AnonymousResourceCollection
    {
        $activities = Activity::with(['user', 'subject'])
            ->when($request->type, function ($query, $type) {
                $query->where('type', $type);
            })
            ->when($request->subject_type, function ($query, $subjectType) {
                $query->where('subject_type', $subjectType);
            })
            ->when($request->subject_id, function ($query, $subjectId) {
                $query->where('subject_id', $subjectId);
            })
            ->latest()
            ->paginate(15);

        return ActivityResource::collection($activities);
    }

    public function addComment(Request $request, VisitorPass $visitorPass)
    {
        $request->validate([
            'comment' => 'required|string|max:1000'
        ]);

        $activity = Activity::logComment(
            $visitorPass,
            $request->user(),
            $request->comment
        );

        return new ActivityResource($activity);
    }

    public function getVisitorPassTimeline(VisitorPass $visitorPass): AnonymousResourceCollection
    {
        $activities = $visitorPass->activities()
            ->with('user')
            ->latest()
            ->get();

        return ActivityResource::collection($activities);
    }
}
