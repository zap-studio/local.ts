use tauri::State;

use crate::database::{DbError, DbPool, models::settings::get_settings};

/// Check if notifications are enabled in settings
#[tauri::command]
pub fn are_notifications_enabled(pool: State<DbPool>) -> Result<bool, DbError> {
    let mut conn = pool.get()?;
    let settings = get_settings(&mut conn)?;
    Ok(settings.enable_notifications)
}

/// Get notification channel states from settings
#[tauri::command]
pub fn get_notification_channels(
    pool: State<DbPool>,
) -> Result<NotificationChannelStates, DbError> {
    let mut conn = pool.get()?;
    let settings = get_settings(&mut conn)?;

    Ok(NotificationChannelStates {
        enabled: settings.enable_notifications,
        general: settings.notify_general,
        reminders: settings.notify_reminders,
        updates: settings.notify_updates,
        alerts: settings.notify_alerts,
        activity: settings.notify_activity,
    })
}

#[derive(Debug, serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub struct NotificationChannelStates {
    pub enabled: bool,
    pub general: bool,
    pub reminders: bool,
    pub updates: bool,
    pub alerts: bool,
    pub activity: bool,
}
