import { createFileRoute } from "@tanstack/react-router";
import { SettingRow } from "@/components/setting-row";
import { SettingsSection } from "@/components/settings-section";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { LOG_LEVEL_OPTIONS, THEME_OPTIONS } from "@/constants/settings";
import { useHandleSettings } from "@/hooks/use-handle-settings";
import type { LogLevel } from "@/lib/tauri/settings/types";

export const Route = createFileRoute("/settings")({
  component: SettingsPage,
});

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
    handleNotificationChange,
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
    <div className="mx-auto w-full max-w-2xl space-y-6 sm:space-y-8">
      <div>
        <h1 className="font-bold text-xl sm:text-2xl">Settings</h1>
        <p className="mt-1 text-muted-foreground text-sm sm:mt-2 sm:text-base">
          Configure your application preferences here.
        </p>
      </div>

      {/* Appearance Section */}
      <SettingsSection
        description="Customize how the application looks"
        title="Appearance"
      >
        <SettingRow
          description="Select your preferred color scheme"
          label="Theme"
        >
          <Select
            className="w-full sm:w-40"
            disabled={isSaving}
            onValueChange={(value) => handleUpdateSetting("theme", value)}
            options={THEME_OPTIONS}
            value={theme}
          />
        </SettingRow>

        <SettingRow
          description="Keep the sidebar expanded by default"
          htmlFor="sidebar-expanded"
          label="Sidebar Expanded"
        >
          <Switch
            checked={settings.sidebarExpanded}
            disabled={isSaving}
            id="sidebar-expanded"
            onCheckedChange={(checked) =>
              handleUpdateSetting("sidebarExpanded", checked)
            }
          />
        </SettingRow>
      </SettingsSection>

      {/* Behavior Section */}
      <SettingsSection
        description="Control how the application behaves"
        title="Behavior"
      >
        <SettingRow
          description="Show the application icon in the system tray"
          htmlFor="show-in-tray"
          label="Show in System Tray"
        >
          <Switch
            checked={settings.showInTray}
            disabled={isSaving}
            id="show-in-tray"
            onCheckedChange={handleTrayVisibilityChange}
          />
        </SettingRow>

        <SettingRow
          description="Automatically start when you log in"
          htmlFor="launch-at-login"
          label="Launch at Login"
        >
          <Switch
            checked={autostartEnabled}
            disabled={isSaving}
            id="launch-at-login"
            onCheckedChange={handleAutostartChange}
          />
        </SettingRow>
      </SettingsSection>

      {/* Notifications Section */}
      <SettingsSection
        description="Configure notification preferences"
        title="Notifications"
      >
        <SettingRow
          description="Allow the app to send you notifications"
          htmlFor="enable-notifications"
          label="Enable Notifications"
        >
          <Switch
            checked={settings.enableNotifications}
            disabled={isSaving}
            id="enable-notifications"
            onCheckedChange={handleNotificationChange}
          />
        </SettingRow>
      </SettingsSection>

      {/* Developer Section */}
      <SettingsSection
        description="Advanced settings for debugging and development"
        title="Developer"
      >
        <SettingRow
          description="Enable detailed application logging"
          htmlFor="enable-logging"
          label="Enable Logging"
        >
          <Switch
            checked={settings.enableLogging}
            disabled={isSaving}
            id="enable-logging"
            onCheckedChange={(checked) =>
              handleUpdateSetting("enableLogging", checked)
            }
          />
        </SettingRow>

        <SettingRow
          description="Set the minimum log level to record"
          label="Log Level"
        >
          <Select<LogLevel>
            className="w-full sm:w-40"
            disabled={isSaving || !settings.enableLogging}
            onValueChange={(value) => handleUpdateSetting("logLevel", value)}
            options={LOG_LEVEL_OPTIONS}
            value={settings.logLevel}
          />
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
