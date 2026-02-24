export type Theme = "light" | "dark" | "system";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface Settings {
  enableLogging: boolean;
  enableNotifications: boolean;
  launchAtLogin: boolean;
  logLevel: LogLevel;
  showInTray: boolean;
  sidebarExpanded: boolean;
  theme: Theme;
}

export type SettingsUpdate = Partial<Settings>;
