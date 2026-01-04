use tauri::{State, tray::TrayIcon};

use crate::database::models::settings::{Settings, SettingsUpdate};
use crate::database::{DbError, DbPool};
use crate::services::settings::{get_settings, update_settings};

/// Get the current application settings
#[tauri::command]
pub fn get_app_settings(pool: State<'_, DbPool>) -> Result<Settings, DbError> {
    let mut conn = pool.get()?;
    get_settings(&mut conn)
}

/// Update application settings with partial data
#[tauri::command]
pub fn update_app_settings(
    pool: State<'_, DbPool>,
    update: SettingsUpdate,
) -> Result<Settings, DbError> {
    let mut conn = pool.get()?;
    update_settings(&mut conn, update)
}

/// Set the system tray icon visibility
#[tauri::command]
pub fn set_tray_visible(tray: State<'_, TrayIcon>, visible: bool) -> Result<(), String> {
    tray.set_visible(visible).map_err(|e| e.to_string())
}
