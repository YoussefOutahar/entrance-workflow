
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card } from "../components/ui/card";
import { Shield, Printer, Menu, LayoutDashboard, Settings, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../components/ui/sidebar";

const Dashboard = () => {
  // Sample data - this would typically come from your backend
  const passes = [
    {
      id: 1,
      fullName: "John Doe",
      idNumber: "ID123456",
      department: "IT Security",
      status: "pending" as const,
      validUntil: "2024-12-31",
      submittedAt: "2024-03-20",
    },
    {
      id: 2,
      fullName: "Jane Smith",
      idNumber: "ID789012",
      department: "Operations",
      status: "approved" as const,
      validUntil: "2024-12-31",
      submittedAt: "2024-03-19",
    },
    {
      id: 3,
      fullName: "Mike Johnson",
      idNumber: "ID345678",
      department: "Administration",
      status: "rejected" as const,
      validUntil: "2024-12-31",
      submittedAt: "2024-03-18",
    },
  ];

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard"
    },
    {
      title: "Settings",
      icon: Settings,
      url: "/settings"
    },
    {
      title: "Profile",
      icon: User,
      url: "/profile"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarContent>
            <SidebarGroup>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
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

        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Pass Management Dashboard</h1>
                <p className="text-muted-foreground">
                  Monitor and manage all pass requests in one place
                </p>
              </div>
              <SidebarTrigger>
                <Menu className="h-6 w-6" />
              </SidebarTrigger>
            </div>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
                <p className="text-muted-foreground text-sm">Total Requests</p>
                <p className="text-3xl font-bold">{passes.length}</p>
              </Card>
              <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
                <p className="text-muted-foreground text-sm">Pending Approval</p>
                <p className="text-3xl font-bold">
                  {passes.filter((pass) => pass.status === "pending").length}
                </p>
              </Card>
              <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow">
                <p className="text-muted-foreground text-sm">Approved Today</p>
                <p className="text-3xl font-bold">
                  {passes.filter((pass) => pass.status === "approved").length}
                </p>
              </Card>
            </div>

            <Card className="shadow-md">
              <div className="p-6 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold">Recent Pass Requests</h2>
                <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                  <Printer className="h-4 w-4" />
                  Print List
                </button>
              </div>
              <div className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>ID Number</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Submitted</TableHead>
                      <TableHead>Valid Until</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {passes.map((pass) => (
                      <TableRow key={pass.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{pass.fullName}</TableCell>
                        <TableCell>{pass.idNumber}</TableCell>
                        <TableCell>{pass.department}</TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pass.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : pass.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                          </span>
                        </TableCell>
                        <TableCell>{pass.submittedAt}</TableCell>
                        <TableCell>{pass.validUntil}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Dashboard;
