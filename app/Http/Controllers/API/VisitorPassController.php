<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVisitorPassRequest;
use App\Http\Requests\UpdateVisitorPassRequest;
use App\Http\Resources\VisitorPassResource;
use App\Models\VisitorPass;
use App\Models\Activity;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class VisitorPassController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $passes = VisitorPass::with(['files', 'activities'])->paginate(10);
        return VisitorPassResource::collection($passes);
    }

    public function store(StoreVisitorPassRequest $request): VisitorPassResource
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();
            $data = $request->except('files');
            $data['created_by'] = $user->id;

            // Set initial status based on user role
            // If admin or chef, set directly to started
            if ($user->hasRole('admin') || $user->hasRole('chef')) {
                $data['status'] = 'started';
            } else {
                $data['status'] = 'awaiting';
            }

            $visitorPass = VisitorPass::create($data);

            // Log creation activity with appropriate message
            $statusMessage = $data['status'] === 'started'
                ? 'Pass created and automatically approved by chef'
                : 'Pass created and awaiting chef approval';

            Activity::create([
                'subject_type' => get_class($visitorPass),
                'subject_id' => $visitorPass->id,
                'type' => 'pass_created',
                'user_id' => Auth::id(),
                'metadata' => [
                    'initial_status' => $visitorPass->status,
                    'visitor_name' => $visitorPass->visitor_name,
                    'visit_date' => $visitorPass->visit_date->format('Y-m-d'),
                    'user_group' => $user->groups()->first() ? $user->groups()->first()->name : null,
                    'system_message' => $statusMessage
                ]
            ]);

            // Process file uploads
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('visitor-passes', 'public');

                    $fileModel = $visitorPass->files()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'type' => $file->getMimeType(),
                        'size' => $file->getSize(),
                        'uploaded_by' => Auth::id()
                    ]);

                    // Log file upload
                    Activity::create([
                        'subject_type' => get_class($visitorPass),
                        'subject_id' => $visitorPass->id,
                        'type' => 'file_uploaded',
                        'user_id' => Auth::id(),
                        'metadata' => [
                            'file_name' => $fileModel->name,
                            'file_size' => $fileModel->size,
                            'file_type' => $fileModel->type,
                            'user_group' => $user->groups()->first() ? $user->groups()->first()->name : null
                        ]
                    ]);
                }
            }

            DB::commit();
            return new VisitorPassResource($visitorPass->load('files'));

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }


    public function show(VisitorPass $visitorPass): VisitorPassResource
    {
        return new VisitorPassResource($visitorPass->load(['files', 'activities']));
    }

    public function update(UpdateVisitorPassRequest $request, VisitorPass $visitorPass): VisitorPassResource
    {
        try {
            DB::beginTransaction();

            $oldData = $visitorPass->getOriginal();
            $visitorPass->update($request->validated());

            // Log update activity
            Activity::create([
                'subject_type' => get_class($visitorPass),
                'subject_id' => $visitorPass->id,
                'type' => 'pass_updated',
                'user_id' => Auth::id(),
                'metadata' => [
                    'changes' => array_diff($visitorPass->getAttributes(), $oldData),
                    'user_group' => Auth::user()->groups()->first() ? Auth::user()->groups()->first()->name : null
                ]
            ]);

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('visitor-passes', 'public');

                    $fileModel = $visitorPass->files()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);

                    // Log file upload activity
                    Activity::create([
                        'subject_type' => get_class($visitorPass),
                        'subject_id' => $visitorPass->id,
                        'type' => 'file_uploaded',
                        'user_id' => Auth::id(),
                        'metadata' => [
                            'file_name' => $fileModel->name,
                            'file_size' => $fileModel->size,
                            'file_type' => $fileModel->type
                        ]
                    ]);
                }
            }

            DB::commit();
            return new VisitorPassResource($visitorPass->load(['files', 'activities']));

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in visitor pass update:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function destroy(VisitorPass $visitorPass)
    {
        try {
            DB::beginTransaction();

            // Log deletion activity before deleting files
            Activity::create([
                'subject_type' => get_class($visitorPass),
                'subject_id' => $visitorPass->id,
                'type' => 'pass_deleted',
                'user_id' => Auth::id(),
                'metadata' => [
                    'pass_id' => $visitorPass->id,
                    'visitor_name' => $visitorPass->visitor_name,
                    'deleted_at' => now()->toIso8601String(),
                    'user_group' => Auth::user()->groups()->first() ? Auth::user()->groups()->first()->name : null
                ]
            ]);

            // Delete associated files from storage
            foreach ($visitorPass->files as $file) {
                Storage::disk('public')->delete($file->path);
            }

            $visitorPass->delete();

            DB::commit();
            return response()->noContent();

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in visitor pass deletion:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
