import { create } from "zustand";
import {
  getSettings,
  updateSettings as updateSettingsCommand,
} from "@/lib/tauri/settings";
import type { Settings } from "@/lib/tauri/settings/types";

interface SettingsStore {
  initialize: () => Promise<void>;
  isLoading: boolean;
  settings: Settings | null;
  updateSettings: (updates: Partial<Settings>) => Promise<Settings>;
}

export const useSettings = create<SettingsStore>((set) => ({
  settings: null,
  isLoading: true,

  initialize: async () => {
    try {
      const settings = await getSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      console.error("Failed to load settings:", error);
      set({ isLoading: false });
    }
  },

  updateSettings: async (updates: Partial<Settings>) => {
    const updatedSettings = await updateSettingsCommand(updates);
    set({ settings: updatedSettings });
    return updatedSettings;
  },
}));
