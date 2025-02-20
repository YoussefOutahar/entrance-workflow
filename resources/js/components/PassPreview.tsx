import { VisitorPass, VisitorPassFormData } from "../types/visitorPass";
import { StatusBadge } from "./StatusBadge";
import { Card } from "./ui/card";
import { Calendar, Clock, Building2, User, Users, FileText } from "lucide-react";

interface PassPreviewProps {
  passData: Partial<VisitorPass | VisitorPassFormData>;
}

export const PassPreview = ({ passData }: PassPreviewProps) => {
  // Helper function to ensure status is of correct type
  const getValidStatus = (status: string | undefined): "pending" | "approved" | "rejected" => {
    if (status === "approved" || status === "rejected" || status === "pending") {
      return status;
    }
    return "pending";
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-6 space-y-6">
        {/* Header Section */}
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {passData.visitor_name || 'Visitor Name'}
          </h3>
          <StatusBadge status={getValidStatus(passData.status)} />
        </div>

        {/* Details Grid */}
        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <User className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">ID Number</p>
              <p className="font-medium">{passData.id_number || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visiting</p>
              <p className="font-medium">{passData.visited_person || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Building2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Unit / Module</p>
              <p className="font-medium">
                {passData.unit} {passData.module && `/ ${passData.module}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Visit Date</p>
              <p className="font-medium">
                {passData.visit_date ? new Date(passData.visit_date).toLocaleDateString() : 'Not specified'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
              <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Duration</p>
              <p className="font-medium">
                {passData.duration_type === 'full_day' 
                  ? 'Full Day' 
                  : passData.duration_days 
                    ? `${passData.duration_days} days` 
                    : 'Not specified'}
              </p>
            </div>
          </div>

          {passData.visit_purpose && (
            <div className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
              <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                <FileText className="h-5 w-5 text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Visit Purpose</p>
                <p className="font-medium">{passData.visit_purpose}</p>
              </div>
            </div>
          )}
        </div>

        {/* Category Badge */}
        {passData.category && (
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              Category: {passData.category}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};