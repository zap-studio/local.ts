import { useCallback, useEffect, useState } from "react";

import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header";
import { SidebarNav } from "@/components/ui/sidebar/sidebar-nav";
import { SidebarSkeleton } from "@/components/ui/sidebar/sidebar-skeleton";
import { SIDEBAR_BOTTOM_ITEMS, SIDEBAR_TOP_ITEMS } from "@/constants/sidebar";
import { useAsyncAction } from "@/hooks/use-async-action";
import { updateSettings } from "@/lib/tauri/settings";
import { cn } from "@/lib/utils";
import { useSettings } from "@/stores/settings";

export function Sidebar() {
  const settings = useSettings((state) => state.settings);
  const isLoading = useSettings((state) => state.isLoading);

  const [expanded, setExpanded] = useState(true);
  const [withSaving] = useAsyncAction();

  useEffect(() => {
    if (settings) {
      setExpanded(settings.sidebarExpanded);
    }
  }, [settings]);

  const toggleExpanded = useCallback(async () => {
    const previousExpanded = expanded;
    const newExpanded = !expanded;
    setExpanded(newExpanded);

    await withSaving(
      async () => {
        await updateSettings({ sidebarExpanded: newExpanded });
      },
      {
        onError: () => setExpanded(previousExpanded),
        errorMessage: "Failed to persist sidebar state",
      }
    );
  }, [expanded, withSaving]);

  if (isLoading) {
    return <SidebarSkeleton />;
  }

  return (
    <aside
      className={cn(
        "flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        expanded ? "w-64" : "w-16"
      )}
    >
      <SidebarHeader expanded={expanded} onToggle={toggleExpanded} />
      <SidebarNav items={SIDEBAR_TOP_ITEMS} expanded={expanded} />
      <SidebarNav
        items={SIDEBAR_BOTTOM_ITEMS}
        expanded={expanded}
        variant="bottom"
      />
    </aside>
  );
}
