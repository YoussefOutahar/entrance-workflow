// pages/Profile.tsx
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Mail, Building2, Phone } from "lucide-react";
import { SidebarTrigger } from "../components/ui/sidebar";

const Profile = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile Settings</h1>
          <p className="text-muted-foreground dark:text-gray-400">
            Manage your account settings and preferences
          </p>
        </div>
        <SidebarTrigger>
          <User className="h-6 w-6 text-gray-700 dark:text-gray-300" />
        </SidebarTrigger>
      </div>

      <div className="grid gap-6">
        <Card className="p-6 dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Personal Information</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">Full Name</Label>
              <div className="relative">
                <Input
                  id="fullName"
                  placeholder="John Doe"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">Email</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="department" className="text-gray-700 dark:text-gray-300">Department</Label>
              <div className="relative">
                <Input
                  id="department"
                  placeholder="IT Department"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
                <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">Phone Number</Label>
              <div className="relative">
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="pl-10 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 dark:placeholder-gray-400"
                />
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;