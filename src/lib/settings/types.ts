/** Theme setting for the application */
export type Theme = "light" | "dark" | "system";

/** Log level setting for the application */
export type LogLevel = "error" | "warn" | "info" | "debug" | "trace";

/** Application settings */
export interface Settings {
  theme: Theme;
  sidebarExpanded: boolean;
  showInTray: boolean;
  launchAtLogin: boolean;
  enableLogging: boolean;
  logLevel: LogLevel;
}

/** Partial settings update - all fields optional */
export type SettingsUpdate = Partial<Settings>;
