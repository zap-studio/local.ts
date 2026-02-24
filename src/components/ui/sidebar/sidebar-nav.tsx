import type { SidebarItem } from "@/components/ui/sidebar/sidebar-nav-item";

import { SidebarNavItem } from "@/components/ui/sidebar/sidebar-nav-item";

interface SidebarNavProps {
  expanded: boolean;
  items: readonly SidebarItem[];
  onItemClick?: () => void;
  variant?: "top" | "bottom";
}

export function SidebarNav({
  items,
  expanded,
  variant = "top",
  onItemClick,
}: SidebarNavProps) {
  const isBottom = variant === "bottom";

  return (
    <nav
      className={`flex flex-col gap-1 p-3 ${isBottom ? "border-sidebar-border border-t" : "flex-1"}`}
    >
      {items.map((item) => (
        <SidebarNavItem
          expanded={expanded}
          item={item}
          key={item.label}
          onClick={onItemClick}
        />
      ))}
    </nav>
  );
}
