import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <h1 className="text-2xl font-bold">Settings</h1>
      <p className="mt-2 text-muted-foreground">
        Configure your application preferences here.
      </p>
    </>
  );
}
