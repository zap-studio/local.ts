export function SidebarSkeleton() {
  return (
    <aside className="hidden h-screen w-64 flex-col border-sidebar-border border-r bg-sidebar md:flex">
      <SidebarHeaderSkeleton />
      <SidebarNavSkeleton />
      <SidebarBottomNavSkeleton />
    </aside>
  );
}

const sidebarNavSkeletonKeys = ["primary-0", "primary-1", "primary-2"];

function SidebarHeaderSkeleton() {
  return (
    <div className="flex h-14 items-center justify-between border-sidebar-border border-b px-3">
      <div className="h-5 w-24 animate-pulse rounded bg-sidebar-foreground/10" />
      <div className="h-9 w-9 animate-pulse rounded-md bg-sidebar-foreground/10" />
    </div>
  );
}

function SidebarNavSkeleton() {
  return (
    <div className="flex-1 space-y-1 p-3">
      {sidebarNavSkeletonKeys.map((key) => (
        <div className="flex h-10 items-center gap-3 px-3" key={key}>
          <div className="size-5 animate-pulse rounded bg-sidebar-foreground/10" />
          <div className="h-4 flex-1 animate-pulse rounded bg-sidebar-foreground/10" />
        </div>
      ))}
    </div>
  );
}

function SidebarBottomNavSkeleton() {
  return (
    <div className="space-y-1 border-sidebar-border border-t p-3">
      <div className="flex h-10 items-center gap-3 px-3">
        <div className="size-5 animate-pulse rounded bg-sidebar-foreground/10" />
        <div className="h-4 flex-1 animate-pulse rounded bg-sidebar-foreground/10" />
      </div>
    </div>
  );
}
