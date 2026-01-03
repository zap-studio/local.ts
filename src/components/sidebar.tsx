import { Home, PanelLeft, PanelLeftClose, Settings } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/button";
import { Tooltip } from "@/components/tooltip";
import { APP_TITLE } from "@/constants";
import { cn } from "@/lib/utils";

interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  onClick?: () => void;
}

interface SidebarProps {
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
}

const topItems: SidebarItem[] = [{ icon: Home, label: "Home", href: "/" }];

const bottomItems: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({
  defaultExpanded = true,
  onExpandedChange,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  const toggleExpanded = () => {
    const newExpanded = !expanded;
    setExpanded(newExpanded);
    onExpandedChange?.(newExpanded);
  };

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      {/* Titlebar */}
      <div
        className={cn(
          "flex h-14 items-center gap-2 border-b border-sidebar-border px-3",
          expanded ? "justify-between" : "justify-center"
        )}
      >
        {expanded && (
          <span className="truncate font-semibold text-sidebar-foreground">
            {APP_TITLE}
          </span>
        )}
        <Tooltip content={expanded ? "Collapse sidebar" : "Expand sidebar"}>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleExpanded}
            aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
            className="h-9 w-9 shrink-0 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          >
            {expanded ? (
              <PanelLeftClose className="size-5" />
            ) : (
              <PanelLeft className="size-5" />
            )}
          </Button>
        </Tooltip>
      </div>

      {/* Top Navigation Items */}
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {topItems.map((item) => (
          <SidebarNavItem key={item.label} item={item} expanded={expanded} />
        ))}
      </nav>

      {/* Bottom Navigation Items */}
      <nav className="flex flex-col gap-1 border-t border-sidebar-border p-3">
        {bottomItems.map((item) => (
          <SidebarNavItem key={item.label} item={item} expanded={expanded} />
        ))}
      </nav>
    </aside>
  );
}

interface SidebarNavItemProps {
  item: SidebarItem;
  expanded: boolean;
}

function SidebarNavItem({ item, expanded }: SidebarNavItemProps) {
  const Icon = item.icon;

  const buttonContent = (
    <Button
      variant="ghost"
      className={cn(
        "w-full text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        expanded ? "justify-start gap-3 px-3" : "justify-center px-0"
      )}
      size={expanded ? "default" : "icon"}
      onClick={item.onClick}
    >
      <Icon className="size-5 shrink-0" />
      {expanded && <span className="truncate">{item.label}</span>}
    </Button>
  );

  if (!expanded) {
    return <Tooltip content={item.label}>{buttonContent}</Tooltip>;
  }

  return buttonContent;
}

export type { SidebarItem, SidebarProps };
