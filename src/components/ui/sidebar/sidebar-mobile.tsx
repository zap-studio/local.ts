import { Menu, X } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { SidebarHeader } from "@/components/ui/sidebar/sidebar-header";
import { SidebarNav } from "@/components/ui/sidebar/sidebar-nav";
import type { SidebarItem } from "@/components/ui/sidebar/sidebar-nav-item";

interface SidebarMobileProps {
  bottomItems: readonly SidebarItem[];
  expanded: boolean;
  onToggle: () => void;
  topItems: readonly SidebarItem[];
}

export function SidebarMobile({
  expanded,
  onToggle,
  topItems,
  bottomItems,
}: SidebarMobileProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const openMobileSidebar = useCallback(() => {
    setMobileOpen(true);
  }, []);

  const closeMobileSidebar = useCallback(() => {
    setMobileOpen(false);
  }, []);

  return (
    <>
      <MobileMenuButton onClick={openMobileSidebar} />
      {mobileOpen && (
        <>
          <MobileOverlay onClick={closeMobileSidebar} />
          <MobileSidebarPanel
            bottomItems={bottomItems}
            expanded={expanded}
            onClose={closeMobileSidebar}
            onToggle={onToggle}
            topItems={topItems}
          />
        </>
      )}
    </>
  );
}

interface MobileMenuButtonProps {
  onClick: () => void;
}

function MobileMenuButton({ onClick }: MobileMenuButtonProps) {
  return (
    <Button
      aria-label="Open menu"
      className="fixed top-3 left-3 z-40 md:hidden"
      onClick={onClick}
      size="icon"
      variant="ghost"
    >
      <Menu className="size-5" />
    </Button>
  );
}

interface MobileOverlayProps {
  onClick: () => void;
}

function MobileOverlay({ onClick }: MobileOverlayProps) {
  return (
    <button
      aria-label="Close menu"
      className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
      onClick={onClick}
      type="button"
    />
  );
}

interface MobileSidebarPanelProps {
  bottomItems: readonly SidebarItem[];
  expanded: boolean;
  onClose: () => void;
  onToggle: () => void;
  topItems: readonly SidebarItem[];
}

function MobileSidebarPanel({
  expanded,
  onToggle,
  topItems,
  bottomItems,
  onClose,
}: MobileSidebarPanelProps) {
  return (
    <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-sidebar-border border-r bg-sidebar md:hidden">
      <Button
        aria-label="Close menu"
        className="absolute top-2 right-2 z-50"
        onClick={onClose}
        size="icon"
        variant="ghost"
      >
        <X className="size-5" />
      </Button>

      <SidebarHeader expanded={expanded} onToggle={onToggle} />
      <SidebarNav expanded={expanded} items={topItems} onItemClick={onClose} />
      <SidebarNav
        expanded={expanded}
        items={bottomItems}
        onItemClick={onClose}
        variant="bottom"
      />
    </aside>
  );
}
