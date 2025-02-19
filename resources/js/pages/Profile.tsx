
import { Card } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { User, Mail, Building2, Phone } from "lucide-react";
import { SidebarProvider, SidebarTrigger, Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "../components/ui/sidebar";

const Profile = () => {
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

        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h1 className="text-2xl font-bold">Profile Settings</h1>
                <p className="text-muted-foreground">
                  Manage your account settings and preferences
                </p>
              </div>
              <SidebarTrigger>
                <User className="h-6 w-6" />
              </SidebarTrigger>
            </div>

            <div className="grid gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <div className="relative">
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        className="pl-10"
                      />
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        className="pl-10"
                      />
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <div className="relative">
                      <Input
                        id="department"
                        placeholder="IT Department"
                        className="pl-10"
                      />
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="relative">
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        className="pl-10"
                      />
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Profile;
