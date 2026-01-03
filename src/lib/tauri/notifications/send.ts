import { sendNotification } from "@tauri-apps/plugin-notification";

import type { NotificationChannel, Settings } from "@/lib/tauri/settings/types";

import { ensureNotificationPermission } from "./permissions";

export interface NotificationOptions {
  title: string;
  body?: string;
  channel: NotificationChannel;
  icon?: string;
}

/**
 * Check if a specific notification channel is enabled in settings
 */
function isChannelEnabled(
  settings: Settings,
  channel: NotificationChannel
): boolean {
  if (!settings.enableNotifications) {
    return false;
  }

  switch (channel) {
    case "general":
      return settings.notifyGeneral;
    case "reminders":
      return settings.notifyReminders;
    case "updates":
      return settings.notifyUpdates;
    case "alerts":
      return settings.notifyAlerts;
    case "activity":
      return settings.notifyActivity;
    default:
      return false;
  }
}

/**
 * Send a notification if the channel is enabled and permission is granted
 * Returns true if the notification was sent, false otherwise
 */
export async function notify(
  options: NotificationOptions,
  settings: Settings
): Promise<boolean> {
  // Check if notifications and the specific channel are enabled
  if (!isChannelEnabled(settings, options.channel)) {
    return false;
  }

  // Ensure we have permission
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) {
    return false;
  }

  // Send the notification
  sendNotification({
    title: options.title,
    body: options.body,
    channelId: options.channel,
    icon: options.icon,
  });

  return true;
}

/**
 * Send a notification without checking settings (for critical alerts)
 * Still requires permission
 */
export async function notifyForced(
  options: Omit<NotificationOptions, "channel"> & {
    channel?: NotificationChannel;
  }
): Promise<boolean> {
  const hasPermission = await ensureNotificationPermission();
  if (!hasPermission) {
    return false;
  }

  sendNotification({
    title: options.title,
    body: options.body,
    channelId: options.channel ?? "alerts",
    icon: options.icon,
  });

  return true;
}
