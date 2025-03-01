// config/sidebarItems.ts
import {
    LayoutDashboard,
    BadgeCheck,
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
            {
                title: "Pass Management",
                icon: BadgeCheck,
                url: PATHS.PASS_MANAGEMENT,
            },
        ],
    },
    // {
    //     group: "Management",
    //     items: [
    //         {
    //             title: "Users",
    //             icon: Users,
    //             url: "/users",
    //         },
    //         {
    //             title: "Security",
    //             icon: Shield,
    //             url: "/security",
    //         },
    //     ],
    // },
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
