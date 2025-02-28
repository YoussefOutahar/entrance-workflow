<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\KpiService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class KpiController extends Controller
{
    protected $kpiService;

    public function __construct(KpiService $kpiService)
    {
        $this->kpiService = $kpiService;
    }

    /**
     * Get dashboard KPIs
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getDashboardKpis(Request $request): JsonResponse
    {
        $timeRange = $request->input('time_range', 'month');
        $unitFilter = $request->input('unit');

        $kpis = $this->kpiService->getDashboardKpis($timeRange, $unitFilter);

        return response()->json([
            'status' => 'success',
            'data' => $kpis
        ]);
    }

    /**
     * Get KPIs for the authenticated user
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getUserKpis(Request $request): JsonResponse
    {
        $timeRange = $request->input('time_range', 'month');
        $userId = auth()->id();

        $kpis = $this->kpiService->getUserKpis($userId, $timeRange);

        return response()->json([
            'status' => 'success',
            'data' => $kpis
        ]);
    }

    /**
     * Get available units for filtering
     *
     * @return JsonResponse
     */
    public function getUnits(): JsonResponse
    {
        $units = \App\Models\VisitorPass::select('unit')
            ->distinct()
            ->orderBy('unit')
            ->pluck('unit')
            ->toArray();

        return response()->json([
            'status' => 'success',
            'data' => $units
        ]);
    }
}
