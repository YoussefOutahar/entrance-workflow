<?php

namespace App\Services;

use App\Models\VisitorPass;
use App\Models\Activity;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class VisitorPassValidationService
{
    /**
     * Validate passes for the current date
     *
     * @return array Statistics about the validation process
     */
    public function validatePasses(): array
    {
        $today = Carbon::today()->toDateString();
        $stats = [
            'total_checked' => 0,
            'validated' => 0,
            'errors' => 0
        ];

        try {
            // Find all passes with today's visit date and that are accepted
            $passes = VisitorPass::where('visit_date', $today)
                ->where('status', 'accepted')
                ->get();

            $stats['total_checked'] = $passes->count();

            foreach ($passes as $pass) {
                try {
                    // Mark the pass as validated in the activity log
                    Activity::create([
                        'subject_type' => get_class($pass),
                        'subject_id' => $pass->id,
                        'type' => 'pass_validated',
                        'user_id' => $pass->approved_by ?? $pass->created_by, // Use approver or creator
                        'metadata' => [
                            'validation_date' => now()->toIso8601String(),
                            'visitor_name' => $pass->visitor_name,
                            'visit_date' => $pass->visit_date->format('Y-m-d'),
                            'system_message' => 'Pass automatically validated for use today'
                        ]
                    ]);

                    $stats['validated']++;
                } catch (\Exception $e) {
                    Log::error('Error validating pass #' . $pass->id, [
                        'pass_id' => $pass->id,
                        'error' => $e->getMessage()
                    ]);
                    $stats['errors']++;
                }
            }

            return $stats;
        } catch (\Exception $e) {
            Log::error('Error in pass validation service', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return [
                'total_checked' => 0,
                'validated' => 0,
                'errors' => 1,
                'message' => $e->getMessage()
            ];
        }
    }
}
