<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\VisitorPassValidationReport;
use App\Services\VisitorPassValidationService;
use Illuminate\Console\Command;
use Illuminate\Support\Carbon;

class ValidateVisitorPasses extends Command
{
    protected $signature = 'visitor-passes:validate {--notify : Send notification with results}';
    protected $description = 'Validate visitor passes for the current date';

    public function handle(VisitorPassValidationService $validationService)
    {
        $this->info('Starting visitor pass validation for ' . Carbon::today()->toDateString());

        $start = now();
        $stats = $validationService->validatePasses();
        $duration = now()->diffInSeconds($start);

        $this->info('Validation complete in ' . $duration . ' seconds');
        $this->table(
            ['Total Checked', 'Validated', 'Errors'],
            [[$stats['total_checked'], $stats['validated'], $stats['errors']]]
        );

        if (isset($stats['message'])) {
            $this->error('Error message: ' . $stats['message']);
        }

        // Send notification if requested
        if ($this->option('notify')) {
            $this->sendNotification($stats);
        }

        return 0;
    }

    /**
     * Send notification to administrators
     */
    protected function sendNotification(array $stats): void
    {
        $this->info('Sending validation report notification...');

        // Find admin users to notify
        $admins = User::whereHas('roles', function ($query) {
            $query->where('slug', 'admin');
        })->get();

        foreach ($admins as $admin) {
            $admin->notify(new VisitorPassValidationReport($stats));
        }

        $this->info('Notification sent to ' . $admins->count() . ' administrators');
    }
}
