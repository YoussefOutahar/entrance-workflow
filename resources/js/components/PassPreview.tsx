
import { Card } from "./ui/card";
import { StatusBadge } from "./StatusBadge";

interface PassPreviewProps {
  passData: {
    fullName: string;
    idNumber: string;
    department: string;
    status: "pending" | "approved" | "rejected";
    validUntil?: string;
  };
}

export const PassPreview = ({ passData }: PassPreviewProps) => {
  return (
    <Card className="w-full max-w-md p-6 space-y-4 animate-fadeIn">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Access Pass</h3>
        <StatusBadge status={passData.status} />
      </div>
      
      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{passData.fullName}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">ID Number</p>
            <p className="font-medium">{passData.idNumber}</p>
          </div>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Department</p>
          <p className="font-medium">{passData.department}</p>
        </div>
        
        {passData.validUntil && (
          <div>
            <p className="text-sm text-muted-foreground">Valid Until</p>
            <p className="font-medium">{passData.validUntil}</p>
          </div>
        )}
      </div>
    </Card>
  );
};
