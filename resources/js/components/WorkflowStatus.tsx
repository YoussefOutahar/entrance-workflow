// components/WorkflowStatus.tsx
import { Check, Clock, AlertCircle, ArrowRight } from "lucide-react";
import React from "react";

interface WorkflowStepProps {
    label: string;
    status: "completed" | "current" | "pending" | "declined";
    description?: string;
}

const WorkflowStep = ({ label, status, description }: WorkflowStepProps) => {
    const getStepIcon = () => {
        switch (status) {
            case "completed":
                return <Check className="h-5 w-5 text-white" />;
            case "current":
                return <Clock className="h-5 w-5 text-white" />;
            case "declined":
                return <AlertCircle className="h-5 w-5 text-white" />;
            default:
                return <div className="h-5 w-5" />;
        }
    };

    const getContainerClass = () => {
        switch (status) {
            case "completed":
                return "bg-green-500";
            case "current":
                return "bg-blue-500";
            case "declined":
                return "bg-red-500";
            default:
                return "bg-gray-300 dark:bg-gray-600";
        }
    };

    return (
        <div className="flex flex-col items-center">
            <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${getContainerClass()}`}
            >
                {getStepIcon()}
            </div>
            <p className="mt-2 text-sm font-medium text-center">{label}</p>
            {description && (
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-center max-w-[120px]">
                    {description}
                </p>
            )}
        </div>
    );
};

interface WorkflowStatusProps {
    currentStatus: string;
}

export const WorkflowStatus = ({ currentStatus }: WorkflowStatusProps) => {
    // Map the current status to the workflow steps
    const getStepStatus = (
        step:
            | "awaiting"
            | "pending_chef"
            | "started"
            | "in_progress"
            | "accepted"
    ): "completed" | "current" | "pending" | "declined" => {
        if (currentStatus === "declined") {
            return "declined";
        }

        const statusOrder = [
            "awaiting",
            "pending_chef",
            "started",
            "in_progress",
            "accepted",
        ];
        const currentIndex = statusOrder.indexOf(currentStatus);
        const stepIndex = statusOrder.indexOf(step);

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="py-4">
            <div className="flex items-center justify-between">
                <WorkflowStep
                    label="Created"
                    status={getStepStatus("awaiting")}
                    description="Initial creation"
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <WorkflowStep
                    label="Chef Review"
                    status={getStepStatus("pending_chef")}
                    description="Dept. chief review"
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <WorkflowStep
                    label="Service Review"
                    status={getStepStatus("started")}
                    description="Service des Permis"
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <WorkflowStep
                    label="Ready for Approval"
                    status={getStepStatus("in_progress")}
                    description="Barrière/Gendarmerie"
                />
                <ArrowRight className="h-4 w-4 text-gray-400" />
                <WorkflowStep
                    label="Final Approval"
                    status={getStepStatus("accepted")}
                    description="Complete"
                />
            </div>
        </div>
    );
};
