import type {
  LogLevel,
  NotificationChannel,
  Theme,
} from "@/lib/tauri/settings/types";

export const THEME_OPTIONS: Array<{ value: Theme; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "system", label: "System" },
];

export const LOG_LEVEL_OPTIONS: Array<{ value: LogLevel; label: string }> = [
  { value: "error", label: "Error" },
  { value: "warn", label: "Warn" },
  { value: "info", label: "Info" },
  { value: "debug", label: "Debug" },
  { value: "trace", label: "Trace" },
];

export interface NotificationChannelConfig {
  id: NotificationChannel;
  name: string;
  description: string;
  settingKey: keyof {
    notifyGeneral: boolean;
    notifyReminders: boolean;
    notifyUpdates: boolean;
    notifyAlerts: boolean;
    notifyActivity: boolean;
  };
  defaultEnabled: boolean;
}

export const NOTIFICATION_CHANNELS: NotificationChannelConfig[] = [
  {
    id: "general",
    name: "General",
    description: "App announcements, tips, and feature updates",
    settingKey: "notifyGeneral",
    defaultEnabled: true,
  },
  {
    id: "reminders",
    name: "Reminders",
    description: "Time-sensitive reminders and scheduled tasks",
    settingKey: "notifyReminders",
    defaultEnabled: true,
  },
  {
    id: "updates",
    name: "Updates",
    description: "App updates and version announcements",
    settingKey: "notifyUpdates",
    defaultEnabled: true,
  },
  {
    id: "alerts",
    name: "Alerts",
    description: "Critical system alerts and security warnings",
    settingKey: "notifyAlerts",
    defaultEnabled: true,
  },
  {
    id: "activity",
    name: "Activity",
    description: "Background task progress and sync status",
    settingKey: "notifyActivity",
    defaultEnabled: false,
  },
];
