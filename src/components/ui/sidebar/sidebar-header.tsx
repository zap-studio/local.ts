import { PanelLeft, PanelLeftClose } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip } from "@/components/ui/tooltip";
import { APP_TITLE } from "@/constants";
import { cn } from "@/lib/utils";

interface SidebarHeaderProps {
  expanded: boolean;
  onToggle: () => void;
}

export function SidebarHeader({ expanded, onToggle }: SidebarHeaderProps) {
  return (
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
          onClick={onToggle}
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
  );
}
