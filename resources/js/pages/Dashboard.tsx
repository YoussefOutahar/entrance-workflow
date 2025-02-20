// pages/Dashboard.tsx
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table";
import { Card } from "../components/ui/card";
import { Printer, Menu } from "lucide-react";
import { SidebarTrigger } from "../components/ui/sidebar";

const Dashboard = () => {
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pass Management Dashboard</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Monitor and manage all pass requests in one place
          </p>
        </div>
        <SidebarTrigger>
          <Menu className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </SidebarTrigger>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-muted-foreground text-sm dark:text-gray-400">Total Requests</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{passes.length}</p>
        </Card>
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-muted-foreground text-sm dark:text-gray-400">Pending Approval</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {passes.filter((pass) => pass.status === "pending").length}
          </p>
        </Card>
        <Card className="p-6 space-y-2 hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
          <p className="text-muted-foreground text-sm dark:text-gray-400">Approved Today</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {passes.filter((pass) => pass.status === "approved").length}
          </p>
        </Card>
      </div>

      <Card className="shadow-md dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 flex justify-between items-center border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Pass Requests</h2>
          <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors">
            <Printer className="h-4 w-4" />
            Print List
          </button>
        </div>
        <div className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="dark:border-gray-700">
                <TableHead className="dark:text-gray-400">Name</TableHead>
                <TableHead className="dark:text-gray-400">ID Number</TableHead>
                <TableHead className="dark:text-gray-400">Department</TableHead>
                <TableHead className="dark:text-gray-400">Status</TableHead>
                <TableHead className="dark:text-gray-400">Submitted</TableHead>
                <TableHead className="dark:text-gray-400">Valid Until</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {passes.map((pass) => (
                <TableRow key={pass.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:border-gray-700">
                  <TableCell className="font-medium dark:text-gray-300">{pass.fullName}</TableCell>
                  <TableCell className="dark:text-gray-300">{pass.idNumber}</TableCell>
                  <TableCell className="dark:text-gray-300">{pass.department}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        pass.status === "pending"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          : pass.status === "approved"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {pass.status.charAt(0).toUpperCase() + pass.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="dark:text-gray-300">{pass.submittedAt}</TableCell>
                  <TableCell className="dark:text-gray-300">{pass.validUntil}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;