import { Button } from "../components/ui/button";
import { PassPreview } from "../components/PassPreview";
import { Check, X, User, Clock, Building2, IdCard } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../components/ui/sidebar";
import { Card, CardContent } from "../components/ui/card";

const PassDetails = () => {
  const { toast } = useToast();
  
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: User,
      url: "/dashboard"
    },
    {
      title: "Profile",
      icon: User,
      url: "/profile"
    }
  ];

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

  // Example pass data - in a real app this would come from your backend
  const passData = {
    fullName: "John Doe",
    idNumber: "ID-12345",
    department: "IT Department",
    status: "pending" as const,
    validUntil: "2024-12-31"
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-6 w-6 text-primary" />
                  <h2 className="font-semibold">Pass Manager</h2>
                </div>
              </div>
              <SidebarGroupContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <a href={item.url} className="flex items-center gap-2">
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  Pass Details
                </h1>
                <p className="text-muted-foreground">
                  Review and manage access pass request
                </p>
              </div>
              <SidebarTrigger>
                <User className="h-6 w-6" />
              </SidebarTrigger>
            </div>

            <div className="grid gap-8">
              <Card className="shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-6 text-gray-800">Access Pass Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                      <div className="p-3 bg-purple-100 rounded-lg">
                        <IdCard className="h-6 w-6 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">ID Number</p>
                        <p className="font-semibold">{passData.idNumber}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Building2 className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Department</p>
                        <p className="font-semibold">{passData.department}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <Clock className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valid Until</p>
                        <p className="font-semibold">{passData.validUntil}</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-white p-6 rounded-lg shadow-lg">
                <PassPreview passData={passData} />
              </div>
              
              <div className="flex gap-4 justify-end">
                <Button
                  variant="outline"
                  className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 border-2 border-red-200 hover:border-red-300 transition-colors px-6 py-2"
                  onClick={handleDecline}
                >
                  <X className="mr-2 h-5 w-5" />
                  Decline Pass
                </Button>
                <Button
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transition-colors px-6 py-2"
                  onClick={handleValidate}
                >
                  <Check className="mr-2 h-5 w-5" />
                  Validate Pass
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PassDetails;
