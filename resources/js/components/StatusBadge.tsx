import { Badge } from "./ui/badge";
import { cn } from "../lib/utils";

type StatusType =
    | "awaiting"
    | "pending_chef"
    | "started"
    | "in_progress"
    | "accepted"
    | "declined"
    | string;

interface StatusBadgeProps {
    status?: StatusType;
    className?: string;
}

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
    const getStatusProperties = (status: StatusType | undefined) => {
        // Handle undefined or null status
        if (!status) {
            return {
                label: "Unknown",
                color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
            };
        }

        switch (status) {
            case "awaiting":
                return {
                    label: "Awaiting Submission",
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                };
            case "pending_chef":
                return {
                    label: "Pending Chef Approval",
                    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                };
            case "started":
                return {
                    label: "Service des Permis Review",
                    color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
                };
            case "in_progress":
                return {
                    label: "Ready for Final Approval",
                    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
                };
            case "accepted":
                return {
                    label: "Approved",
                    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                };
            case "declined":
                return {
                    label: "Rejected",
                    color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
                };
            default:
                // Use string literal and type assertion to tell TypeScript that status is a string
                const statusString = String(status);
                return {
                    label:
                        statusString.charAt(0).toUpperCase() +
                        statusString.slice(1),
                    color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
                };
        }
    };

    const { label, color } = getStatusProperties(status);

    return (
        <Badge
            variant="outline"
            className={cn(
                "capitalize font-medium px-2.5 py-0.5 rounded-full text-xs",
                color,
                className
            )}
        >
            {label}
        </Badge>
    );
};
