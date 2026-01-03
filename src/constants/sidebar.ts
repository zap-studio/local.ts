import { Home, Settings } from "lucide-react";

import type { SidebarItem } from "@/components/ui/sidebar";

export const SIDEBAR_TOP_ITEMS: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/" },
];

export const SIDEBAR_BOTTOM_ITEMS: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
];
