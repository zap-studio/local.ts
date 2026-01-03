import { createFileRoute } from "@tanstack/react-router";

import type { LogLevel } from "@/lib/settings/types";

import { Label } from "@/components/label";
import { Select } from "@/components/select";
import { Switch } from "@/components/switch";
import { useHandleSettings } from "@/hooks/use-handle-settings";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

const themeOptions = [
  { value: "light" as const, label: "Light" },
  { value: "dark" as const, label: "Dark" },
  { value: "system" as const, label: "System" },
];

const logLevelOptions = [
  { value: "error" as const, label: "Error" },
  { value: "warn" as const, label: "Warn" },
  { value: "info" as const, label: "Info" },
  { value: "debug" as const, label: "Debug" },
  { value: "trace" as const, label: "Trace" },
];

function SettingsPage() {
  const {
    theme,
    settings,
    autostartEnabled,
    isLoading,
    isSaving,
    handleUpdateSetting,
    handleAutostartChange,
    handleTrayVisibilityChange,
  } = useHandleSettings();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center p-12">
        <p className="text-destructive">Failed to load settings</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-muted-foreground">
          Configure your application preferences here.
        </p>
      </div>

      {/* Appearance Section */}
      <SettingsSection
        title="Appearance"
        description="Customize how the application looks"
      >
        <SettingRow
          label="Theme"
          description="Select your preferred color scheme"
        >
          <Select
            value={theme}
            onValueChange={(value) => handleUpdateSetting("theme", value)}
            options={themeOptions}
            disabled={isSaving}
            className="w-40"
          />
        </SettingRow>

        <SettingRow
          label="Sidebar Expanded"
          description="Keep the sidebar expanded by default"
          htmlFor="sidebar-expanded"
        >
          <Switch
            id="sidebar-expanded"
            checked={settings.sidebarExpanded}
            onCheckedChange={(checked) =>
              handleUpdateSetting("sidebarExpanded", checked)
            }
            disabled={isSaving}
          />
        </SettingRow>
      </SettingsSection>

      {/* Behavior Section */}
      <SettingsSection
        title="Behavior"
        description="Control how the application behaves"
      >
        <SettingRow
          label="Show in System Tray"
          description="Show the application icon in the system tray"
          htmlFor="show-in-tray"
        >
          <Switch
            id="show-in-tray"
            checked={settings.showInTray}
            onCheckedChange={handleTrayVisibilityChange}
            disabled={isSaving}
          />
        </SettingRow>

        <SettingRow
          label="Launch at Login"
          description="Automatically start when you log in"
          htmlFor="launch-at-login"
        >
          <Switch
            id="launch-at-login"
            checked={autostartEnabled}
            onCheckedChange={handleAutostartChange}
            disabled={isSaving}
          />
        </SettingRow>
      </SettingsSection>

      {/* Developer Section */}
      <SettingsSection
        title="Developer"
        description="Advanced settings for debugging and development"
      >
        <SettingRow
          label="Enable Logging"
          description="Enable detailed application logging"
          htmlFor="enable-logging"
        >
          <Switch
            id="enable-logging"
            checked={settings.enableLogging}
            onCheckedChange={(checked) =>
              handleUpdateSetting("enableLogging", checked)
            }
            disabled={isSaving}
          />
        </SettingRow>

        <SettingRow
          label="Log Level"
          description="Set the minimum log level to record"
        >
          <Select<LogLevel>
            value={settings.logLevel}
            onValueChange={(value) => handleUpdateSetting("logLevel", value)}
            options={logLevelOptions}
            disabled={isSaving || !settings.enableLogging}
            className="w-40"
          />
        </SettingRow>
      </SettingsSection>
    </div>
  );
}

interface SettingsSectionProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps) {
  return (
    <section className="space-y-4">
      <div className="border-b border-border pb-2">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

interface SettingRowProps {
  label: string;
  description: string;
  htmlFor?: string;
  children: React.ReactNode;
}

function SettingRow({
  label,
  description,
  htmlFor,
  children,
}: SettingRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4">
      <div className="space-y-0.5">
        <Label htmlFor={htmlFor} className="text-base font-medium">
          {label}
        </Label>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
