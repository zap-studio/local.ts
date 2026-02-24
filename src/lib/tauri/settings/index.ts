import { invoke } from "@tauri-apps/api/core";

import type { Settings, SettingsUpdate } from "./types";

export function getSettings(): Promise<Settings> {
  return invoke<Settings>("get_app_settings");
}

export function updateSettings(update: SettingsUpdate): Promise<Settings> {
  return invoke<Settings>("update_app_settings", { update });
}

export function setTrayVisible(visible: boolean): Promise<void> {
  return invoke("set_tray_visible", { visible });
}
