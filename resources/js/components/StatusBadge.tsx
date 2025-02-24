// components/StatusBadge.tsx
import { cn } from "../lib/utils";

interface StatusBadgeProps {
    status?: "awaiting" | "declined" | "started" | "in_progress" | "accepted";
    className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const getStatusStyles = () => {
        switch (status) {
            case "awaiting":
                return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200";
            case "declined":
                return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-200";
            case "started":
                return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200";
            case "in_progress":
                return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-200";
            case "accepted":
                return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200";
            default:
                return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-200";
        }
    };

    const getStatusLabel = () => {
        switch (status) {
            case "awaiting":
                return "Awaiting Review";
            case "declined":
                return "Declined";
            case "started":
                return "Review Started";
            case "in_progress":
                return "In Progress";
            case "accepted":
                return "Accepted";
            default:
                return "Unknown Status";
        }
    };

    return (
        <span
            className={cn(
                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                getStatusStyles(),
                className
            )}
        >
            {getStatusLabel()}
        </span>
    );
};
