// pages/PassDetails.tsx
import { Button } from "../components/ui/button";
import { PassPreview } from "../components/PassPreview";
import { Check, X, User, Clock, Building2, IdCard } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { SidebarTrigger } from "../components/ui/sidebar";
import { Card, CardContent } from "../components/ui/card";

const PassDetails = () => {
  const { toast } = useToast();

  const handleValidate = () => {
    toast({
      title: "Pass Validated",
      description: "The access pass has been approved successfully."
    });
  };

  const handleDecline = () => {
    toast({
      title: "Pass Declined",
      description: "The access pass has been declined."
    });
  };

  const passData = {
    fullName: "John Doe",
    idNumber: "ID-12345",
    department: "IT Department",
    status: "pending" as const,
    validUntil: "2024-12-31"
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Pass Details
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Review and manage access pass request
          </p>
        </div>
        <SidebarTrigger>
          <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </SidebarTrigger>
      </div>

      <div className="grid gap-8">
        <Card className="shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-6 text-gray-800 dark:text-gray-200">Access Pass Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                  <IdCard className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">ID Number</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{passData.idNumber}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                  <Building2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Department</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{passData.department}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-green-50 dark:bg-green-900/30 rounded-lg">
                <div className="p-3 bg-green-100 dark:bg-green-900/50 rounded-lg">
                  <Clock className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground dark:text-gray-400">Valid Until</p>
                  <p className="font-semibold text-gray-900 dark:text-gray-200">{passData.validUntil}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
          <PassPreview passData={passData} />
        </div>
        
        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            className="bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-colors px-6 py-2"
            onClick={handleDecline}
          >
            <X className="mr-2 h-5 w-5" />
            Decline Pass
          </Button>
          <Button
            className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-500 dark:to-emerald-500 hover:from-green-700 hover:to-emerald-700 dark:hover:from-green-600 dark:hover:to-emerald-600 text-white transition-colors px-6 py-2"
            onClick={handleValidate}
          >
            <Check className="mr-2 h-5 w-5" />
            Validate Pass
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PassDetails;