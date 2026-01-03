import { invoke } from "@tauri-apps/api/core";

import type { Settings, SettingsUpdate } from "./types";

/** Get the current application settings */
export async function getSettings(): Promise<Settings> {
  return invoke<Settings>("get_app_settings");
}

/** Update application settings with partial data */
export async function updateSettings(
  update: SettingsUpdate
): Promise<Settings> {
  return invoke<Settings>("update_app_settings", { update });
}

/** Set the system tray icon visibility */
export async function setTrayVisible(visible: boolean): Promise<void> {
  return invoke("set_tray_visible", { visible });
}
