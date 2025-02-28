// src/pages/KpiDashboard.tsx
import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import {
    Menu,
    TrendingUp,
    Clock,
    FileText,
    CheckCircle,
    XCircle,
    BarChart3,
} from "lucide-react";
import { SidebarTrigger } from "../components/ui/sidebar";
import { KpiService, DashboardKpiData } from "../services/kpi.service";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from "recharts";

const KpiDashboard = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [kpiData, setKpiData] = useState<DashboardKpiData | null>(null);
    const [timeRange, setTimeRange] = useState<string>("month");
    const [unitFilter, setUnitFilter] = useState<string>("all");
    const [units, setUnits] = useState<string[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [kpiResponse, unitsResponse] = await Promise.all([
                    KpiService.getDashboardKpis(
                        timeRange,
                        unitFilter === "all" ? undefined : unitFilter
                    ),
                    KpiService.getUnits(),
                ]);
                setKpiData(kpiResponse);
                setUnits(unitsResponse);
            } catch (error) {
                console.error("Error fetching KPI data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange, unitFilter]);

    // Format trend data for chart
    const formatTrendData = () => {
        if (!kpiData?.trend_data) return [];

        return Object.entries(kpiData.trend_data).map(([date, count]) => ({
            date,
            count,
        }));
    };

    // Format unit data for chart
    const formatUnitData = () => {
        if (!kpiData?.passes_by_unit) return [];

        return Object.entries(kpiData.passes_by_unit).map(([unit, count]) => ({
            unit,
            count,
        }));
    };

    // Format category data for chart
    const formatCategoryData = () => {
        if (!kpiData?.passes_by_category) return [];

        return Object.entries(kpiData.passes_by_category).map(
            ([category, count]) => ({
                category:
                    category === "S-T"
                        ? "Short Term"
                        : category === "Ch"
                        ? "Chef"
                        : "External",
                count,
            })
        );
    };

    // Format status data for chart
    const formatStatusData = () => {
        if (!kpiData?.status_breakdown) return [];

        const statusLabels: Record<string, string> = {
            awaiting: "Awaiting",
            pending_chef: "Pending Chef",
            started: "Started",
            in_progress: "In Progress",
            accepted: "Accepted",
            declined: "Declined",
        };

        return Object.entries(kpiData.status_breakdown).map(
            ([status, count]) => ({
                status: statusLabels[status] || status,
                count,
            })
        );
    };

    const getTimeRangeLabel = (range: string) => {
        const labels: Record<string, string> = {
            day: "Today",
            week: "Last 7 Days",
            month: "Last 30 Days",
            year: "Last 365 Days",
        };
        return labels[range] || "Last 30 Days";
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="text-center py-12">
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Loading KPI data...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div className="space-y-1">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Pass Management KPIs
                    </h1>
                    <p className="text-muted-foreground dark:text-gray-400">
                        Key performance indicators for the visitor pass system
                    </p>
                </div>
                <SidebarTrigger>
                    <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
                </SidebarTrigger>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select time range" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="day">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">Last 30 Days</SelectItem>
                            <SelectItem value="year">Last 365 Days</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4">
                    <Select value={unitFilter} onValueChange={setUnitFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by unit" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Units</SelectItem>
                            {units.map((unit) => (
                                <SelectItem key={unit} value={unit}>
                                    {unit}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
                <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground text-sm dark:text-gray-400">
                            Total Passes
                        </p>
                        <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {kpiData?.total_passes || 0}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {getTimeRangeLabel(timeRange)}
                    </p>
                </Card>

                <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground text-sm dark:text-gray-400">
                            Pending Approval
                        </p>
                        <Clock className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {kpiData?.pending_approval || 0}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Awaiting decisions
                    </p>
                </Card>

                <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground text-sm dark:text-gray-400">
                            Approved
                        </p>
                        <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {kpiData?.approved || 0}
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                        {getTimeRangeLabel(timeRange)}
                    </p>
                </Card>

                <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex justify-between items-center">
                        <p className="text-muted-foreground text-sm dark:text-gray-400">
                            Approval Rate
                        </p>
                        <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {kpiData?.approval_rate || 0}%
                    </p>
                    <p className="text-xs text-muted-foreground dark:text-gray-400">
                        Of all decisions made
                    </p>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Pass Trend
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Visitor pass submissions over time
                        </p>
                    </div>
                    <div className="p-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={formatTrendData()}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#374151"
                                />
                                <XAxis
                                    dataKey="date"
                                    stroke="#9CA3AF"
                                    tickFormatter={(value) => {
                                        // Format date based on time range
                                        if (timeRange === "year") {
                                            return value; // Already in 'YYYY-MM' format
                                        } else if (timeRange === "day") {
                                            return value.split(" ")[1]; // Return just the hour
                                        } else {
                                            const [year, month, day] =
                                                value.split("-");
                                            return `${month}/${day}`;
                                        }
                                    }}
                                />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        borderColor: "#374151",
                                        color: "#F9FAFB",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3B82F6"
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Processing Time
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Average time from submission to decision
                        </p>
                    </div>
                    <div className="p-6 flex flex-col items-center justify-center h-80">
                        <div className="text-center mb-8">
                            <p className="text-5xl font-bold text-blue-500 dark:text-blue-400">
                                {kpiData?.processing_times.avg_hours || 0}
                            </p>
                            <p className="text-lg text-gray-600 dark:text-gray-400">
                                Average Hours
                            </p>
                        </div>

                        <div className="grid grid-cols-2 w-full gap-4">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    {kpiData?.processing_times.min_hours || 0}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Minimum Hours
                                </p>
                            </div>

                            <div className="text-center">
                                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                                    {kpiData?.processing_times.max_hours || 0}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Maximum Hours
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mb-8">
                <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Passes by Unit
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Top 5 units by number of passes
                        </p>
                    </div>
                    <div className="p-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={formatUnitData()}
                                layout="vertical"
                                margin={{
                                    top: 5,
                                    right: 30,
                                    left: 40,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#374151"
                                />
                                <XAxis type="number" stroke="#9CA3AF" />
                                <YAxis
                                    dataKey="unit"
                                    type="category"
                                    stroke="#9CA3AF"
                                    width={100}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        borderColor: "#374151",
                                        color: "#F9FAFB",
                                    }}
                                />
                                <Bar dataKey="count" fill="#10B981" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>

                <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-4 border-b dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Pass Status Distribution
                        </h2>
                        <p className="text-sm text-muted-foreground dark:text-gray-400">
                            Number of passes by current status
                        </p>
                    </div>
                    <div className="p-4 h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={formatStatusData()}
                                margin={{
                                    top: 20,
                                    right: 20,
                                    left: 20,
                                    bottom: 20,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#374151"
                                />
                                <XAxis dataKey="status" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#1F2937",
                                        borderColor: "#374151",
                                        color: "#F9FAFB",
                                    }}
                                />
                                <Bar dataKey="count" fill="#8B5CF6" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
                <div className="p-4 border-b dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                        Passes by Category
                    </h2>
                    <p className="text-sm text-muted-foreground dark:text-gray-400">
                        Distribution across visitor categories
                    </p>
                </div>
                <div className="p-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={formatCategoryData()}
                            margin={{
                                top: 20,
                                right: 20,
                                left: 20,
                                bottom: 20,
                            }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="#374151"
                            />
                            <XAxis dataKey="category" stroke="#9CA3AF" />
                            <YAxis stroke="#9CA3AF" />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "#1F2937",
                                    borderColor: "#374151",
                                    color: "#F9FAFB",
                                }}
                            />
                            <Bar dataKey="count" fill="#EC4899" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>
        </div>
    );
};

export default KpiDashboard;
