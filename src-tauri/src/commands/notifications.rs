use tauri::State;

use crate::{
    database::{DbError, DbPool},
    services::settings::get_settings,
};

/// Check if notifications are enabled in settings
#[tauri::command]
pub fn are_notifications_enabled(pool: State<DbPool>) -> Result<bool, DbError> {
    let mut conn = pool.get()?;
    let settings = get_settings(&mut conn)?;
    Ok(settings.enable_notifications)
}
