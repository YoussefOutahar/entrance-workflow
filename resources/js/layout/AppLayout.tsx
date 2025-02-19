import { ReactNode } from 'react';
import { BadgeCheck, LayoutDashboard, Settings, Shield, User, Users } from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "../components/ui/Sidebar";
import { PATHS } from '../routes/paths';

type SidebarItem = {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  url: string;
};

type SidebarGroup = {
  group: string;
  items: SidebarItem[];
};

interface AppLayoutProps {
  children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const sidebarItems = [
    {
      group: "Overview",
      items: [
        {
          title: "Dashboard",
          icon: LayoutDashboard,
          url: PATHS.DASHBOARD
        },
        {
          title: "Pass Management",
          icon: BadgeCheck,
          url: PATHS.PASS_MANAGEMENT
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
          url: PATHS.PROFILE
        },
        {
          title: "Settings",
          icon: Settings,
          url: "/settings"
        }
      ]
    }
  ];

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
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};