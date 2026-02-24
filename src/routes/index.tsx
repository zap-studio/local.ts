import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <h1 className="font-bold text-2xl">Welcome</h1>
      <p className="mt-2 text-muted-foreground">
        Select a page from the sidebar to get started.
      </p>
    </>
  );
}
