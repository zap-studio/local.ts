use std::fs;
use std::path::PathBuf;
use tauri::{AppHandle, Manager};

use crate::database::DbError;

pub fn bool_to_int(b: bool) -> i32 {
    if b { 1 } else { 0 }
}

pub fn int_to_bool(i: i32) -> bool {
    i != 0
}

pub fn get_database_path(app: &AppHandle) -> Result<PathBuf, DbError> {
    let app_data_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| DbError::Init(format!("Failed to get app data directory: {}", e)))?;

    // Ensure the directory exists
    fs::create_dir_all(&app_data_dir)
        .map_err(|e| DbError::Init(format!("Failed to create app data directory: {}", e)))?;

    Ok(app_data_dir.join("local.db"))
}
