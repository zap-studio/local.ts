import {
  isPermissionGranted,
  requestPermission,
} from "@tauri-apps/plugin-notification";

export type NotificationPermissionStatus = "granted" | "denied" | "default";

/**
 * Check if notification permission is granted
 */
export async function checkNotificationPermission(): Promise<boolean> {
  return isPermissionGranted();
}

/**
 * Request notification permission from the user
 * Returns true if permission was granted, false otherwise
 */
export async function requestNotificationPermission(): Promise<boolean> {
  const permission = await requestPermission();
  return permission === "granted";
}

/**
 * Ensure notification permission is granted
 * Requests permission if not already granted
 * Returns true if permission is granted (existing or newly granted)
 */
export async function ensureNotificationPermission(): Promise<boolean> {
  const granted = await checkNotificationPermission();
  if (granted) {
    return true;
  }
  return requestNotificationPermission();
}
