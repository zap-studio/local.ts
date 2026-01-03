import { createFileRoute } from "@tanstack/react-router";

import type { LogLevel } from "@/lib/tauri/settings/types";

import { SettingRow } from "@/components/setting-row";
import { SettingsSection } from "@/components/settings-section";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  LOG_LEVEL_OPTIONS,
  NOTIFICATION_CHANNELS,
  THEME_OPTIONS,
} from "@/constants/settings";
import { useHandleSettings } from "@/hooks/use-handle-settings";

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
        <h1 className="text-xl font-bold sm:text-2xl">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:mt-2 sm:text-base">
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
            options={THEME_OPTIONS}
            disabled={isSaving}
            className="w-full sm:w-40"
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

      {/* Notifications Section */}
      <SettingsSection
        title="Notifications"
        description="Configure notification preferences"
      >
        <SettingRow
          label="Enable Notifications"
          description="Allow the app to send you notifications"
          htmlFor="enable-notifications"
        >
          <Switch
            id="enable-notifications"
            checked={settings.enableNotifications}
            onCheckedChange={(checked) =>
              handleUpdateSetting("enableNotifications", checked)
            }
            disabled={isSaving}
          />
        </SettingRow>

        {NOTIFICATION_CHANNELS.map((channel) => (
          <SettingRow
            key={channel.id}
            label={channel.name}
            description={channel.description}
            htmlFor={`notify-${channel.id}`}
          >
            <Switch
              id={`notify-${channel.id}`}
              checked={settings[channel.settingKey]}
              onCheckedChange={(checked) =>
                handleUpdateSetting(channel.settingKey, checked)
              }
              disabled={isSaving || !settings.enableNotifications}
            />
          </SettingRow>
        ))}
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
            options={LOG_LEVEL_OPTIONS}
            disabled={isSaving || !settings.enableLogging}
            className="w-full sm:w-40"
          />
        </SettingRow>
      </SettingsSection>
    </div>
  );
}
