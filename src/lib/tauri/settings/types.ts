export type Theme = "light" | "dark" | "system";

export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

export interface Settings {
  theme: Theme;
  sidebarExpanded: boolean;
  showInTray: boolean;
  launchAtLogin: boolean;
  enableLogging: boolean;
  logLevel: LogLevel;
}

export type SettingsUpdate = Partial<Settings>;
