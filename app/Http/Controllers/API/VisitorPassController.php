<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreVisitorPassRequest;
use App\Http\Requests\UpdateVisitorPassRequest;
use App\Http\Resources\VisitorPassResource;
use App\Models\VisitorPass;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Facades\Storage;

class VisitorPassController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $passes = VisitorPass::with('files')->paginate(10);
        return VisitorPassResource::collection($passes);
    }

    public function store(StoreVisitorPassRequest $request): VisitorPassResource
    {
        \Log::info('Received request', [
            'files' => $request->hasFile('files'),
            'allFiles' => $request->allFiles(),
            'all' => $request->all()
        ]);

        try {
            $visitorPass = VisitorPass::create($request->except('files'));

            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    \Log::info('Processing file', [
                        'name' => $file->getClientOriginalName(),
                        'size' => $file->getSize(),
                        'mimeType' => $file->getMimeType()
                    ]);

                    $path = $file->store('visitor-passes', 'public');

                    $visitorPass->files()->create([
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'type' => $file->getMimeType(),
                        'size' => $file->getSize()
                    ]);
                }
            }

            return new VisitorPassResource($visitorPass->load('files'));
        } catch (\Exception $e) {
            \Log::error('Error in store method', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'message' => 'Error creating visitor pass',
                'error' => $e->getMessage()
            ], 422);
        }
    }

    public function show(VisitorPass $visitorPass): VisitorPassResource
    {
        return new VisitorPassResource($visitorPass->load('files'));
    }

    public function update(UpdateVisitorPassRequest $request, VisitorPass $visitorPass): VisitorPassResource
    {
        $visitorPass->update($request->validated());

        if ($request->hasFile('files')) {
            foreach ($request->file('files') as $file) {
                $path = $file->store('visitor-passes', 'public');

                $visitorPass->files()->create([
                    'name' => $file->getClientOriginalName(),
                    'path' => $path,
                    'type' => $file->getClientMimeType(),
                    'size' => $file->getSize()
                ]);
            }
        }

        return new VisitorPassResource($visitorPass->load('files'));
    }

    public function destroy(VisitorPass $visitorPass)
    {
        foreach ($visitorPass->files as $file) {
            Storage::disk('public')->delete($file->path);
        }

        $visitorPass->delete();
        return response()->noContent();
    }
}
