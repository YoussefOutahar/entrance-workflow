// config/sidebarItems.ts
import {
    LayoutDashboard,
    BadgeCheck,
    Plus,
    Users,
    Shield,
    User,
    Settings,
} from "lucide-react";
import { PATHS } from "../routes/paths";
import { LucideIcon } from "lucide-react";

export interface SidebarItem {
    title: string;
    icon: LucideIcon;
    url: string;
}

export interface SidebarGroup {
    group: string;
    items: SidebarItem[];
}

export type SidebarItems = SidebarGroup[];

export const sidebarItems: SidebarItems = [
    {
        group: "Overview",
        items: [
            {
                title: "Dashboard",
                icon: LayoutDashboard,
                url: PATHS.DASHBOARD,
            },
        ],
    },
    {
        group: "Management",
        items: [
            {
                title: "New Pass",
                icon: Plus,
                url: PATHS.CREATE_PASS,
            },
            {
                title: "Pass Management",
                icon: BadgeCheck,
                url: PATHS.PASS_MANAGEMENT,
            },
        ],
    },
    {
        group: "Settings",
        items: [
            {
                title: "Profile",
                icon: User,
                url: PATHS.PROFILE,
            },
        ],
    },
];
