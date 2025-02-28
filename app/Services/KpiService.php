<?php

namespace App\Services;

use App\Models\VisitorPass;
use App\Models\User;
use App\Models\Activity;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class KpiService
{
    /**
     * Get dashboard KPIs for the visitor pass system
     *
     * @param string $timeRange day|week|month|year
     * @param string|null $unitFilter Filter by specific unit
     * @return array
     */
    public function getDashboardKpis(string $timeRange = 'month', ?string $unitFilter = null): array
    {
        $startDate = $this->getStartDate($timeRange);

        // Build base query with date filter
        $baseQuery = VisitorPass::where('created_at', '>=', $startDate);

        // Apply unit filter if provided
        if ($unitFilter) {
            $baseQuery->where('unit', $unitFilter);
        }

        // Total passes
        $totalPasses = (clone $baseQuery)->count();

        // Status breakdown
        $statusCounts = (clone $baseQuery)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Processing time metrics
        $processingTimes = $this->calculateProcessingTimes($startDate, $unitFilter);

        // Approval rates
        $approvedCount = $statusCounts['accepted'] ?? 0;
        $declinedCount = $statusCounts['declined'] ?? 0;
        $approvalRate = ($totalPasses > 0)
            ? round(($approvedCount / $totalPasses) * 100, 1)
            : 0;

        // Passes by unit
        $passesByUnit = (clone $baseQuery)
            ->select('unit', DB::raw('count(*) as count'))
            ->groupBy('unit')
            ->orderByDesc('count')
            ->limit(5)
            ->pluck('count', 'unit')
            ->toArray();

        // Passes by category
        $passesByCategory = (clone $baseQuery)
            ->select('category', DB::raw('count(*) as count'))
            ->groupBy('category')
            ->pluck('count', 'category')
            ->toArray();

        // Trend data (passes created by day for the period)
        $trend = $this->getTrendData($startDate, $timeRange, $unitFilter);

        return [
            'total_passes' => $totalPasses,
            'pending_approval' => ($statusCounts['pending_chef'] ?? 0) + ($statusCounts['started'] ?? 0) + ($statusCounts['in_progress'] ?? 0),
            'approved' => $approvedCount,
            'declined' => $declinedCount,
            'approval_rate' => $approvalRate,
            'status_breakdown' => $statusCounts,
            'passes_by_unit' => $passesByUnit,
            'passes_by_category' => $passesByCategory,
            'processing_times' => $processingTimes,
            'trend_data' => $trend,
            'time_range' => $timeRange
        ];
    }

    /**
     * Get user-specific KPIs for the visitor pass system
     *
     * @param int $userId
     * @param string $timeRange day|week|month|year
     * @return array
     */
    public function getUserKpis(int $userId, string $timeRange = 'month'): array
    {
        $startDate = $this->getStartDate($timeRange);
        $user = User::findOrFail($userId);

        // Visitor passes created by user
        $userPasses = VisitorPass::where('created_by', $userId)
            ->where('created_at', '>=', $startDate)
            ->get();

        $totalCreated = $userPasses->count();

        // Status breakdown for user's passes
        $statusCounts = $userPasses->groupBy('status')
            ->map(function ($group) {
                return $group->count();
            })->toArray();

        // Activities by user
        $activities = Activity::where('user_id', $userId)
            ->where('created_at', '>=', $startDate)
            ->count();

        // Average processing time for user's passes
        $avgProcessingTime = $userPasses
            ->filter(function ($pass) {
                return $pass->status === 'accepted' || $pass->status === 'declined';
            })
            ->avg(function ($pass) {
                $created = Carbon::parse($pass->created_at);
                $statusChanged = Carbon::parse($pass->status_changed_at);
                return $created->diffInHours($statusChanged);
            }) ?? 0;

        return [
            'total_created' => $totalCreated,
            'pending_approval' => ($statusCounts['pending_chef'] ?? 0) + ($statusCounts['started'] ?? 0) + ($statusCounts['in_progress'] ?? 0),
            'approved' => $statusCounts['accepted'] ?? 0,
            'declined' => $statusCounts['declined'] ?? 0,
            'activities' => $activities,
            'avg_processing_time' => round($avgProcessingTime, 1),
            'time_range' => $timeRange
        ];
    }

    /**
     * Calculate processing time metrics
     */
    private function calculateProcessingTimes(Carbon $startDate, ?string $unitFilter = null): array
    {
        // Build query for completed passes
        $query = VisitorPass::whereIn('status', ['accepted', 'declined'])
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('status_changed_at');

        if ($unitFilter) {
            $query->where('unit', $unitFilter);
        }

        $passes = $query->get();

        if ($passes->isEmpty()) {
            return [
                'avg_hours' => 0,
                'min_hours' => 0,
                'max_hours' => 0
            ];
        }

        // Calculate processing times
        $processingTimes = $passes->map(function ($pass) {
            $created = Carbon::parse($pass->created_at);
            $completed = Carbon::parse($pass->status_changed_at);
            return $created->diffInHours($completed);
        });

        return [
            'avg_hours' => round($processingTimes->avg(), 1),
            'min_hours' => $processingTimes->min(),
            'max_hours' => $processingTimes->max()
        ];
    }

    /**
     * Get trend data for the specified time range
     */
    private function getTrendData(Carbon $startDate, string $timeRange, ?string $unitFilter = null): array
    {
        // Determine grouping format based on time range
        $groupFormat = match ($timeRange) {
            'day' => 'Y-m-d H:00', // Group by hour for day view
            'week' => 'Y-m-d',     // Group by day for week view
            'month' => 'Y-m-d',    // Group by day for month view
            'year' => 'Y-m',       // Group by month for year view
            default => 'Y-m-d'
        };

        // Build base query
        $query = VisitorPass::where('created_at', '>=', $startDate);

        if ($unitFilter) {
            $query->where('unit', $unitFilter);
        }

        // Get raw data from database
        $rawData = $query
            ->select(DB::raw("DATE_FORMAT(created_at, '{$groupFormat}') as date"), DB::raw('count(*) as count'))
            ->groupBy('date')
            ->orderBy('date')
            ->pluck('count', 'date')
            ->toArray();

        // Generate complete date range with 0 values for missing dates
        $result = [];
        $current = clone $startDate;
        $endDate = Carbon::now();

        while ($current <= $endDate) {
            $formattedDate = $current->format($this->getPhpDateFormat($groupFormat));
            $result[$formattedDate] = $rawData[$formattedDate] ?? 0;

            // Increment based on time range
            switch ($timeRange) {
                case 'day':
                    $current->addHour();
                    break;
                case 'week':
                case 'month':
                    $current->addDay();
                    break;
                case 'year':
                    $current->addMonth();
                    break;
            }
        }

        return $result;
    }

    /**
     * Convert MySQL date format to PHP date format
     */
    private function getPhpDateFormat(string $mysqlFormat): string
    {
        return match ($mysqlFormat) {
            'Y-m-d H:00' => 'Y-m-d H:00',
            'Y-m-d' => 'Y-m-d',
            'Y-m' => 'Y-m',
            default => 'Y-m-d'
        };
    }

    /**
     * Calculate start date based on time range
     */
    private function getStartDate(string $timeRange): Carbon
    {
        return match ($timeRange) {
            'day' => Carbon::now()->startOfDay(),
            'week' => Carbon::now()->subDays(7)->startOfDay(),
            'month' => Carbon::now()->subDays(30)->startOfDay(),
            'year' => Carbon::now()->subDays(365)->startOfDay(),
            default => Carbon::now()->subDays(30)->startOfDay()
        };
    }
}
