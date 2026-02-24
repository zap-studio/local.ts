import { createRootRoute, Outlet } from "@tanstack/react-router";

import { Sidebar } from "@/components/ui/sidebar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div
          className="h-14 shrink-0 border-border border-b"
          data-tauri-drag-region
        />
        <div className="flex-1 overflow-auto p-4 pt-6 md:p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
