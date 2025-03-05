<?php

namespace App\Services;

use App\Models\VisitorPass;
use App\Models\Activity;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class VisitorPassValidationService
{
    /**
     * Validate passes whose due date has been reached
     *
     * @return array Statistics about the validation process
     */
    public function validatePasses(): array
    {
        $today = Carbon::today();
        $stats = [
            'total_checked' => 0,
            'validated' => 0,
            'errors' => 0,
            'auto_accepted' => 0,
            'diagnostics' => []
        ];

        try {
            // Get diagnostic info
            $allPasses = VisitorPass::count();
            $stats['diagnostics']['total_passes_in_system'] = $allPasses;

            // First, find all passes that need to be moved to "accepted" status
            // These are passes that have past dates but aren't in a final state (accepted or declined)
            $pendingPasses = VisitorPass::whereDate('visit_date', '<=', $today)
                ->whereNotIn('status', ['accepted', 'declined'])
                ->get();

            $stats['diagnostics']['pending_passes_found'] = $pendingPasses->count();

            // Auto-accept these passes
            foreach ($pendingPasses as $pass) {
                try {
                    // Log the status change
                    Activity::create([
                        'subject_type' => get_class($pass),
                        'subject_id' => $pass->id,
                        'type' => 'status_changed',
                        'user_id' => $pass->approved_by ?? $pass->created_by ?? 1,
                        'metadata' => [
                            'old_status' => $pass->status,
                            'new_status' => 'accepted',
                            'changed_date' => now()->toIso8601String(),
                            'system_message' => 'Status automatically updated to accepted due to pass date being reached'
                        ]
                    ]);

                    // Update the pass status
                    $pass->status = 'accepted';
                    $pass->status_changed_at = now();
                    $pass->save();

                    $stats['auto_accepted']++;
                } catch (\Exception $e) {
                    $stats['errors']++;
                    $stats['diagnostics']['error_messages'][] = "Error auto-accepting pass #{$pass->id}: " . $e->getMessage();
                }
            }

            // Now find all passes with accepted status that need validation
            $passesToValidate = VisitorPass::where('status', 'accepted')
                ->whereDate('visit_date', '<=', $today)
                ->get();

            $stats['diagnostics']['passes_to_validate_found'] = $passesToValidate->count();
            $stats['total_checked'] = $passesToValidate->count();

            // Validate each pass
            foreach ($passesToValidate as $pass) {
                // Check if already validated
                $alreadyValidated = Activity::where('subject_type', get_class($pass))
                    ->where('subject_id', $pass->id)
                    ->where('type', 'pass_validated')
                    ->exists();

                if (!$alreadyValidated) {
                    try {
                        // Mark the pass as validated in the activity log
                        Activity::create([
                            'subject_type' => get_class($pass),
                            'subject_id' => $pass->id,
                            'type' => 'pass_validated',
                            'user_id' => $pass->approved_by ?? $pass->created_by ?? 1,
                            'metadata' => [
                                'validation_date' => now()->toIso8601String(),
                                'visitor_name' => $pass->visitor_name,
                                'visit_date' => Carbon::parse($pass->visit_date)->format('Y-m-d'),
                                'validation_type' => Carbon::parse($pass->visit_date)->isToday() ? 'current_day' : 'past_due',
                                'system_message' => Carbon::parse($pass->visit_date)->isToday()
                                    ? 'Pass automatically validated for use today'
                                    : 'Pass automatically validated (past due date)'
                            ]
                        ]);

                        $stats['validated']++;
                    } catch (\Exception $e) {
                        $stats['errors']++;
                        $stats['diagnostics']['error_messages'][] = "Error validating pass #{$pass->id}: " . $e->getMessage();
                    }
                } else {
                    $stats['diagnostics']['already_validated_count'] = ($stats['diagnostics']['already_validated_count'] ?? 0) + 1;
                }
            }

            return $stats;
        } catch (\Exception $e) {
            return [
                'total_checked' => 0,
                'validated' => 0,
                'errors' => 1,
                'auto_accepted' => 0,
                'message' => $e->getMessage(),
                'diagnostics' => $stats['diagnostics'] ?? []
            ];
        }
    }
}
