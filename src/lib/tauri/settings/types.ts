export type Theme = "light" | "dark" | "system";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export type NotificationChannel =
  | "general"
  | "reminders"
  | "updates"
  | "alerts"
  | "activity";

export interface Settings {
  theme: Theme;
  sidebarExpanded: boolean;
  showInTray: boolean;
  launchAtLogin: boolean;
  enableLogging: boolean;
  logLevel: LogLevel;
  enableNotifications: boolean;
  notifyGeneral: boolean;
  notifyReminders: boolean;
  notifyUpdates: boolean;
  notifyAlerts: boolean;
  notifyActivity: boolean;
}

export type SettingsUpdate = Partial<Settings>;
