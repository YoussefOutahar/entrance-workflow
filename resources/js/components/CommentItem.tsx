import React from "react";
import { Activity } from "../types/visitorPass";
import { MessageSquare, History, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentItemProps {
    activity: Activity;
}

export const CommentItem = ({ activity }: CommentItemProps) => {
    const getActivityIcon = () => {
        switch (activity.type) {
            case "comment":
                return <MessageSquare className="h-4 w-4 text-blue-600" />;
            case "file_uploaded":
                return <FileText className="h-4 w-4 text-amber-600" />;
            default:
                return <History className="h-4 w-4 text-blue-600" />;
        }
    };

    return (
        <div className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full h-fit">
                {getActivityIcon()}
            </div>
            <div className="space-y-1 flex-grow">
                <p className="text-sm font-medium">{activity.message}</p>
                <div className="flex items-center text-xs text-gray-500">
                    <span>By {activity.user.name}</span>
                    {activity.metadata?.user_group && (
                        <>
                            <span className="mx-1">•</span>
                            <span>{activity.metadata.user_group}</span>
                        </>
                    )}
                    <span className="mx-1">•</span>
                    <span>{activity.formatted_date}</span>
                </div>
                {activity.type === "comment" && activity.metadata?.comment ? (
                    <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-600 rounded text-sm">
                        {activity.metadata.comment}
                    </div>
                ) : activity.metadata?.notes ? (
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 p-2 bg-gray-100 dark:bg-gray-600 rounded">
                        {activity.metadata.notes}
                    </p>
                ) : null}
            </div>
        </div>
    );
};
