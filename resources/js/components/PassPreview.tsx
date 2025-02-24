// components/PassPreview.tsx
import { VisitorPass, VisitorPassFormData } from "../types/visitorPass";
import { StatusBadge } from "./StatusBadge";
import { Card } from "./ui/card";
import {
    Calendar,
    Clock,
    Building2,
    User,
    Users,
    FileText,
    Briefcase,
    BadgeCheck,
    Building,
} from "lucide-react";
import { cn } from "../lib/utils";

interface PassPreviewProps {
    passData: Partial<VisitorPass | VisitorPassFormData>;
    className?: string;
}

export const PassPreview = ({ passData, className }: PassPreviewProps) => {
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    return (
        <Card className={cn("overflow-hidden", className)}>
            <div className="p-6 space-y-6">
                {/* Header Section */}
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {passData.visitor_name || "Visitor Name"}
                        </h3>
                        <div className="flex items-center gap-2">
                            <StatusBadge status={passData.status as any} />
                            {passData.category && (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                    Category: {passData.category}
                                </span>
                            )}
                        </div>
                    </div>
                    {passData.organization && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 dark:bg-gray-800 rounded-lg">
                            <Briefcase className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                {passData.organization}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <InfoItem
                            icon={
                                <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            }
                            label="ID Number"
                            value={passData.id_number}
                            bgColor="bg-purple-100 dark:bg-purple-900/30"
                        />

                        <InfoItem
                            icon={
                                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            }
                            label="Visiting"
                            value={passData.visited_person}
                            bgColor="bg-blue-100 dark:bg-blue-900/30"
                        />

                        <InfoItem
                            icon={
                                <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                            }
                            label="Unit"
                            value={passData.unit}
                            bgColor="bg-green-100 dark:bg-green-900/30"
                        />

                        <InfoItem
                            icon={
                                <Building className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                            }
                            label="Module"
                            value={passData.module}
                            bgColor="bg-teal-100 dark:bg-teal-900/30"
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-4">
                        <InfoItem
                            icon={
                                <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                            }
                            label="Visit Date"
                            value={
                                passData.visit_date
                                    ? formatDate(passData.visit_date)
                                    : undefined
                            }
                            bgColor="bg-amber-100 dark:bg-amber-900/30"
                        />

                        <InfoItem
                            icon={
                                <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                            }
                            label="Duration"
                            value={
                                passData.duration_type === "full_day"
                                    ? "Full Day"
                                    : passData.duration_days
                                    ? `${passData.duration_days} days`
                                    : undefined
                            }
                            bgColor="bg-indigo-100 dark:bg-indigo-900/30"
                        />

                        {passData.visit_purpose && (
                            <InfoItem
                                icon={
                                    <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                                }
                                label="Visit Purpose"
                                value={passData.visit_purpose}
                                bgColor="bg-rose-100 dark:bg-rose-900/30"
                            />
                        )}

                        {passData.approved_by && (
                            <InfoItem
                                icon={
                                    <BadgeCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                                }
                                label="Approved By"
                                value={passData.approved_by}
                                bgColor="bg-emerald-100 dark:bg-emerald-900/30"
                            />
                        )}
                    </div>
                </div>

                {/* Additional Info Section */}
                {(passData.hierarchy_approval || passData.spp_approval) && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-3">
                            {passData.hierarchy_approval && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200">
                                    Hierarchy Approved
                                </span>
                            )}
                            {passData.spp_approval && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200">
                                    SPP Approved
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Card>
    );
};

interface InfoItemProps {
    icon: React.ReactNode;
    label: string;
    value?: string | number | null;
    bgColor: string;
}

const InfoItem = ({ icon, label, value, bgColor }: InfoItemProps) => (
    <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
        <div className={cn("p-2 rounded-lg", bgColor)}>{icon}</div>
        <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
            <p className="font-medium">{value || "Not specified"}</p>
        </div>
    </div>
);
