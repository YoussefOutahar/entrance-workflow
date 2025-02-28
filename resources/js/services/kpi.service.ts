// src/services/kpi.service.ts
import axiosInstance from "../config/axios.config";
import { API_ROUTES } from "../config/api.config";

export interface DashboardKpiData {
    total_passes: number;
    pending_approval: number;
    approved: number;
    declined: number;
    approval_rate: number;
    status_breakdown: Record<string, number>;
    passes_by_unit: Record<string, number>;
    passes_by_category: Record<string, number>;
    processing_times: {
        avg_hours: number;
        min_hours: number;
        max_hours: number;
    };
    trend_data: Record<string, number>;
    time_range: string;
}

export interface UserKpiData {
    total_created: number;
    pending_approval: number;
    approved: number;
    declined: number;
    activities: number;
    avg_processing_time: number;
    time_range: string;
}

export class KpiService {
    static async getDashboardKpis(
        timeRange: string = "month",
        unitFilter?: string
    ): Promise<DashboardKpiData> {
        try {
            const params: any = { time_range: timeRange };
            if (unitFilter) {
                params.unit = unitFilter;
            }

            const response = await axiosInstance.get(API_ROUTES.KPI.DASHBOARD, {
                params,
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching dashboard KPIs:", error);
            throw error;
        }
    }

    static async getUserKpis(
        timeRange: string = "month"
    ): Promise<UserKpiData> {
        try {
            const response = await axiosInstance.get(API_ROUTES.KPI.USER, {
                params: { time_range: timeRange },
            });
            return response.data.data;
        } catch (error) {
            console.error("Error fetching user KPIs:", error);
            throw error;
        }
    }

    static async getUnits(): Promise<string[]> {
        try {
            const response = await axiosInstance.get(API_ROUTES.KPI.UNITS);
            return response.data.data;
        } catch (error) {
            console.error("Error fetching units for KPI filtering:", error);
            throw error;
        }
    }
}
