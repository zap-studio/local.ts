import { Outlet, createRootRoute } from "@tanstack/react-router";

import { Sidebar } from "@/components/sidebar";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-hidden">
        <div
          data-tauri-drag-region
          className="h-14 shrink-0 border-b border-border"
        />
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
