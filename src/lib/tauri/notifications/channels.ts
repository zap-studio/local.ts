import {
  type Channel,
  Importance,
  Visibility,
  channels,
  createChannel,
  removeChannel,
} from "@tauri-apps/plugin-notification";

import type { NotificationChannel } from "@/lib/tauri/settings/types";

export interface NotificationChannelDefinition {
  id: NotificationChannel;
  name: string;
  description: string;
  importance: Importance;
  visibility: Visibility;
}

export const CHANNEL_DEFINITIONS: NotificationChannelDefinition[] = [
  {
    id: "general",
    name: "General",
    description: "App announcements, tips, and feature updates",
    importance: Importance.Default,
    visibility: Visibility.Public,
  },
  {
    id: "reminders",
    name: "Reminders",
    description: "Time-sensitive reminders and scheduled tasks",
    importance: Importance.High,
    visibility: Visibility.Private,
  },
  {
    id: "updates",
    name: "Updates",
    description: "App updates and version announcements",
    importance: Importance.Low,
    visibility: Visibility.Public,
  },
  {
    id: "alerts",
    name: "Alerts",
    description: "Critical system alerts and security warnings",
    importance: Importance.High,
    visibility: Visibility.Public,
  },
  {
    id: "activity",
    name: "Activity",
    description: "Background task progress and sync status",
    importance: Importance.Min,
    visibility: Visibility.Public,
  },
];

/**
 * Initialize all notification channels
 * Should be called once on app startup
 */
export async function initializeNotificationChannels(): Promise<void> {
  await Promise.all(
    CHANNEL_DEFINITIONS.map((channel) =>
      createChannel({
        id: channel.id,
        name: channel.name,
        description: channel.description,
        importance: channel.importance,
        visibility: channel.visibility,
      })
    )
  );
}

/**
 * Get all existing notification channels
 */
export async function getNotificationChannels(): Promise<Channel[]> {
  return channels();
}

/**
 * Remove a specific notification channel
 */
export async function deleteNotificationChannel(
  channelId: NotificationChannel
): Promise<void> {
  await removeChannel(channelId);
}
