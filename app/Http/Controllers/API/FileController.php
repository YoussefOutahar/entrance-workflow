<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\File;
use App\Models\Activity;
use App\Models\VisitorPass;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class FileController extends Controller
{
    public function store(Request $request, VisitorPass $visitorPass)
    {
        $request->validate([
            'files.*' => 'required|file|mimes:pdf,doc,docx,jpg,jpeg,png|max:10240'
        ]);

        try {
            DB::beginTransaction();

            $files = [];
            if ($request->hasFile('files')) {
                foreach ($request->file('files') as $file) {
                    $path = $file->store('visitor-passes', 'public');

                    $fileModel = File::create([
                        'visitor_pass_id' => $visitorPass->id,
                        'name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'type' => $file->getClientMimeType(),
                        'size' => $file->getSize()
                    ]);

                    $files[] = $fileModel;

                    // Log file upload activity
                    Activity::create([
                        'subject_type' => get_class($visitorPass),
                        'subject_id' => $visitorPass->id,
                        'type' => 'file_uploaded',
                        'user_id' => auth()->id(),
                        'metadata' => [
                            'file_name' => $fileModel->name,
                            'file_size' => $fileModel->size,
                            'file_type' => $fileModel->type
                        ]
                    ]);
                }
            }

            DB::commit();
            return response()->json(['files' => $files], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in file upload:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public function destroy(File $file)
    {
        try {
            DB::beginTransaction();

            $visitorPass = $file->visitorPass;
            $fileName = $file->name;

            Storage::disk('public')->delete($file->path);
            $file->delete();

            // Log file deletion activity
            Activity::create([
                'subject_type' => get_class($visitorPass),
                'subject_id' => $visitorPass->id,
                'type' => 'file_deleted',
                'user_id' => auth()->id(),
                'metadata' => [
                    'file_name' => $fileName,
                    'deleted_at' => now()->toIso8601String()
                ]
            ]);

            DB::commit();
            return response()->noContent();

        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error in file deletion:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
