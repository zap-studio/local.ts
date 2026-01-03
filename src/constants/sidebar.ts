import { Home, Settings } from "lucide-react";

import type { SidebarItem } from "@/components/sidebar";

/** Top navigation items in the sidebar */
export const SIDEBAR_TOP_ITEMS: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/" },
];

/** Bottom navigation items in the sidebar */
export const SIDEBAR_BOTTOM_ITEMS: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
];
