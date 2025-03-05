<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('visitor-passes:validate --notify')
    ->dailyAt('06:00')
    ->appendOutputTo(storage_path('logs/visitor-pass-validation.log'));
