
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { Eye, Search, User, Filter, PlusCircle, Download, FileDown, LayoutDashboard, Settings, Shield, Users, BadgeCheck } from "lucide-react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../components/ui/sidebar";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";

const PassManagement = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const sidebarItems = [
    {
      group: "Overview",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: "/dashboard"
        },
        {
          title: "Pass Management",
          icon: BadgeCheck,
          url: "/passes"
        }
      ]
    },
    {
      group: "Management",
      items: [
        {
          title: "Users",
          icon: Users,
          url: "/users"
        },
        {
          title: "Security",
          icon: Shield,
          url: "/security"
        }
      ]
    },
    {
      group: "Settings",
      items: [
        {
          title: "Profile",
          icon: User,
          url: "/profile"
        },
        {
          title: "Settings",
          icon: Settings,
          url: "/settings"
        }
      ]
    }
  ];

  const passes = [
    {
      id: "1",
      fullName: "John Doe",
      idNumber: "ID-12345",
      department: "IT Department",
      status: "pending" as const,
      validUntil: "2024-12-31",
      createdAt: "2024-01-15"
    },
    {
      id: "2",
      fullName: "Jane Smith",
      idNumber: "ID-67890",
      department: "HR Department",
      status: "approved" as const,
      validUntil: "2024-12-31",
      createdAt: "2024-01-20"
    },
    {
      id: "3",
      fullName: "Mike Johnson",
      idNumber: "ID-11121",
      department: "Marketing",
      status: "rejected" as const,
      validUntil: "2024-12-31",
      createdAt: "2024-01-25"
    }
  ];

  const filteredPasses = passes
    .filter(pass => {
      const matchesSearch = pass.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pass.idNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          pass.department.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || pass.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const exportToCSV = () => {
    const headers = ["Full Name", "ID Number", "Department", "Status", "Valid Until", "Created At"];
    const csvContent = [
      headers.join(","),
      ...filteredPasses.map(pass => [
        pass.fullName,
        pass.idNumber,
        pass.department,
        pass.status,
        pass.validUntil,
        pass.createdAt
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "passes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    const jsonContent = JSON.stringify(filteredPasses, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "passes.json");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r bg-gradient-to-b from-gray-50 to-white">
          <SidebarContent>
            <SidebarGroup>
              <div className="p-6">
                <div className="flex items-center gap-3 mb-8">
                  <Shield className="h-7 w-7 text-purple-600" />
                  <h2 className="font-semibold text-xl text-gray-800">Pass Manager</h2>
                </div>
              </div>
              <SidebarGroupContent>
                {sidebarItems.map((group) => (
                  <div key={group.group} className="mb-8 px-3">
                    <h3 className="px-3 text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                      {group.group}
                    </h3>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton asChild>
                            <a 
                              href={item.url} 
                              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                window.location.pathname === item.url 
                                  ? "bg-purple-50 text-purple-700" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <item.icon className={`h-5 w-5 transition-colors ${
                                window.location.pathname === item.url
                                  ? "text-purple-600"
                                  : "text-gray-400 group-hover:text-gray-600"
                              }`} />
                              <span className="text-sm font-medium">{item.title}</span>
                              {window.location.pathname === item.url && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600" />
                              )}
                            </a>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </div>
                ))}
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600">
                  Pass Management
                </h1>
                <p className="text-muted-foreground">
                  View and manage all access passes
                </p>
              </div>
              <div className="flex items-center gap-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <FileDown className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-48">
                    <DropdownMenuItem onClick={exportToCSV}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={exportToJSON}>
                      <Download className="h-4 w-4 mr-2" />
                      Export as JSON
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="default" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  New Pass
                </Button>
                <SidebarTrigger>
                  <User className="h-6 w-6" />
                </SidebarTrigger>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, ID, or department..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select
                    value={statusFilter}
                    onValueChange={setStatusFilter}
                  >
                    <SelectTrigger className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-4">
                {filteredPasses.map((pass) => (
                  <Card key={pass.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-4">
                            <h3 className="text-lg font-semibold">{pass.fullName}</h3>
                            <StatusBadge status={pass.status} />
                          </div>
                          <div className="flex items-center gap-6 text-sm text-muted-foreground">
                            <span>{pass.idNumber}</span>
                            <span>{pass.department}</span>
                            <span>Valid until: {pass.validUntil}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a href={`/pass/${pass.id}`}>
                            <Eye className="h-4 w-4" />
                            View Details
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {filteredPasses.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No passes found matching your criteria.
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default PassManagement;
