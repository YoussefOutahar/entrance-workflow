import React, { ReactNode } from "react";
import { Shield, LogOut } from "lucide-react";
import {
    SidebarProvider,
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "../components/ui/sidebar";
import { ThemeToggle } from "../components/layout/ThemeToggle";
import { sidebarItems } from "../layout/navigation";
import { Button } from "../components/ui/button";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth.service";

interface AppLayoutProps {
    children: ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
    const { clearAuth } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await authService.logout();
            clearAuth();
            navigate("/auth");
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full">
                <Sidebar className="border-r bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 dark:border-gray-700 flex flex-col">
                    <SidebarContent className="flex-1">
                        <SidebarGroup>
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-8">
                                    <Shield className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200">
                                        Pass Manager
                                    </h2>
                                </div>
                            </div>
                            <SidebarGroupContent>
                                {sidebarItems.map((group) => (
                                    <div
                                        key={group.group}
                                        className="mb-8 px-3"
                                    >
                                        <h3 className="px-3 text-xs font-semibold text-gray-400 dark:text-gray-500 mb-3 uppercase tracking-wider">
                                            {group.group}
                                        </h3>
                                        <SidebarMenu>
                                            {group.items.map((item) => (
                                                <SidebarMenuItem
                                                    key={item.title}
                                                >
                                                    <SidebarMenuButton asChild>
                                                        <a
                                                            href={item.url}
                                                            className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
                                                                window.location
                                                                    .pathname ===
                                                                item.url
                                                                    ? "bg-purple-50 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300"
                                                                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200"
                                                            }`}
                                                        >
                                                            <item.icon
                                                                className={`h-5 w-5 transition-colors ${
                                                                    window
                                                                        .location
                                                                        .pathname ===
                                                                    item.url
                                                                        ? "text-purple-600 dark:text-purple-400"
                                                                        : "text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-400"
                                                                }`}
                                                            />
                                                            <span className="text-sm font-medium">
                                                                {item.title}
                                                            </span>
                                                            {window.location
                                                                .pathname ===
                                                                item.url && (
                                                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
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

                    {/* Theme and Logout section */}
                    <div className="border-t dark:border-gray-700">
                        {/* Theme Toggle */}
                        <div className="p-4">
                            <div className="flex items-center justify-between px-3">
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                    Theme
                                </span>
                                <ThemeToggle />
                            </div>
                        </div>

                        {/* Logout Button */}
                        <div className="p-4 pt-0">
                            <Button
                                variant="ghost"
                                onClick={handleLogout}
                                className="w-full flex items-center justify-start px-3 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                            >
                                <LogOut className="h-5 w-5 mr-2" />
                                <span className="text-sm font-medium">
                                    Logout
                                </span>
                            </Button>
                        </div>
                    </div>
                </Sidebar>
                <main className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    );
};
