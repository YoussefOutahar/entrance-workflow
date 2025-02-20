// pages/PassManagement.tsx
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { StatusBadge } from "../components/StatusBadge";
import { Eye, Search, User, Filter, PlusCircle, Download, FileDown } from "lucide-react";
import { SidebarTrigger } from "../components/ui/sidebar";
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
    <div className="container mx-auto px-4 py-8 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 dark:from-purple-400 dark:to-blue-400">
            Pass Management
          </h1>
          <p className="text-muted-foreground dark:text-gray-400">
            View and manage all access passes
          </p>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700">
                <FileDown className="h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48 dark:bg-gray-800 dark:border-gray-700">
              <DropdownMenuItem onClick={exportToCSV} className="dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export as CSV
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToJSON} className="dark:text-gray-300 dark:hover:bg-gray-700">
                <Download className="h-4 w-4 mr-2" />
                Export as JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="default" className="gap-2 dark:bg-purple-600 dark:hover:bg-purple-700">
            <PlusCircle className="h-4 w-4" />
            New Pass
          </Button>
          <SidebarTrigger>
            <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          </SidebarTrigger>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-400" />
            <Input
              placeholder="Search by name, ID, or department..."
              className="pl-10 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:placeholder-gray-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="w-full sm:w-48">
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                <SelectItem value="all" className="dark:text-gray-300 dark:hover:bg-gray-700">All Statuses</SelectItem>
                <SelectItem value="pending" className="dark:text-gray-300 dark:hover:bg-gray-700">Pending</SelectItem>
                <SelectItem value="approved" className="dark:text-gray-300 dark:hover:bg-gray-700">Approved</SelectItem>
                <SelectItem value="rejected" className="dark:text-gray-300 dark:hover:bg-gray-700">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredPasses.map((pass) => (
            <Card key={pass.id} className="hover:shadow-md transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-4">
                      <h3 className="text-lg font-semibold dark:text-gray-200">{pass.fullName}</h3>
                      <StatusBadge status={pass.status} />
                    </div>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground dark:text-gray-400">
                      <span>{pass.idNumber}</span>
                      <span>{pass.department}</span>
                      <span>Valid until: {pass.validUntil}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
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
            <div className="text-center py-8 text-muted-foreground dark:text-gray-400">
              No passes found matching your criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PassManagement;