
import { cn } from "@/lib/utils";

type Status = "pending" | "approved" | "rejected";

interface StatusBadgeProps {
  status: Status;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const statusConfig = {
    pending: {
      color: "bg-pass-pending",
      text: "Pending",
    },
    approved: {
      color: "bg-pass-approved",
      text: "Approved",
    },
    rejected: {
      color: "bg-pass-rejected",
      text: "Rejected",
    },
  };

  return (
    <span
      className={cn(
        "px-3 py-1 rounded-full text-white text-sm font-medium animate-fadeIn",
        statusConfig[status].color
      )}
    >
      {statusConfig[status].text}
    </span>
  );
};
