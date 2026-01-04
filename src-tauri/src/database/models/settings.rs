use diesel::prelude::*;
use serde::{Deserialize, Serialize};

use crate::database::DbError;
use crate::database::schema::settings;
use crate::database::utils::{bool_to_int, int_to_bool};

/// Theme setting for the application
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum Theme {
    Light,
    Dark,
    System,
}

impl Theme {
    pub fn as_str(&self) -> &'static str {
        match self {
            Theme::Light => "light",
            Theme::Dark => "dark",
            Theme::System => "system",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, DbError> {
        match s {
            "light" => Ok(Theme::Light),
            "dark" => Ok(Theme::Dark),
            "system" => Ok(Theme::System),
            _ => Err(DbError::InvalidData(format!("Invalid theme: {}", s))),
        }
    }
}

/// Log level setting for the application
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum LogLevel {
    Error,
    Warn,
    Info,
    Debug,
    Trace,
}

impl LogLevel {
    pub fn as_str(&self) -> &'static str {
        match self {
            LogLevel::Error => "error",
            LogLevel::Warn => "warn",
            LogLevel::Info => "info",
            LogLevel::Debug => "debug",
            LogLevel::Trace => "trace",
        }
    }

    pub fn from_str(s: &str) -> Result<Self, DbError> {
        match s {
            "error" => Ok(LogLevel::Error),
            "warn" => Ok(LogLevel::Warn),
            "info" => Ok(LogLevel::Info),
            "debug" => Ok(LogLevel::Debug),
            "trace" => Ok(LogLevel::Trace),
            _ => Err(DbError::InvalidData(format!("Invalid log level: {}", s))),
        }
    }
}

/// Raw settings row from the database
/// SQLite uses INTEGER for boolean values (0 = false, 1 = true)
#[derive(Debug, Queryable, Selectable)]
#[diesel(table_name = settings)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct SettingsRow {
    pub theme: String,
    pub sidebar_expanded: i32,
    pub show_in_tray: i32,
    pub launch_at_login: i32,
    pub enable_logging: i32,
    pub log_level: String,
    pub enable_notifications: i32,
    pub notify_general: i32,
    pub notify_reminders: i32,
    pub notify_updates: i32,
    pub notify_alerts: i32,
    pub notify_activity: i32,
}

/// Application settings with typed enums
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
    pub theme: Theme,
    pub sidebar_expanded: bool,
    pub show_in_tray: bool,
    pub launch_at_login: bool,
    pub enable_logging: bool,
    pub log_level: LogLevel,
    pub enable_notifications: bool,
    pub notify_general: bool,
    pub notify_reminders: bool,
    pub notify_updates: bool,
    pub notify_alerts: bool,
    pub notify_activity: bool,
}

impl Settings {
    /// Convert from database row to typed settings
    pub fn from_row(row: SettingsRow) -> Result<Self, DbError> {
        Ok(Self {
            theme: Theme::from_str(&row.theme)?,
            sidebar_expanded: int_to_bool(row.sidebar_expanded),
            show_in_tray: int_to_bool(row.show_in_tray),
            launch_at_login: int_to_bool(row.launch_at_login),
            enable_logging: int_to_bool(row.enable_logging),
            log_level: LogLevel::from_str(&row.log_level)?,
            enable_notifications: int_to_bool(row.enable_notifications),
            notify_general: int_to_bool(row.notify_general),
            notify_reminders: int_to_bool(row.notify_reminders),
            notify_updates: int_to_bool(row.notify_updates),
            notify_alerts: int_to_bool(row.notify_alerts),
            notify_activity: int_to_bool(row.notify_activity),
        })
    }
}

/// Partial settings update - all fields optional
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SettingsUpdate {
    pub theme: Option<Theme>,
    pub sidebar_expanded: Option<bool>,
    pub show_in_tray: Option<bool>,
    pub launch_at_login: Option<bool>,
    pub enable_logging: Option<bool>,
    pub log_level: Option<LogLevel>,
    pub enable_notifications: Option<bool>,
    pub notify_general: Option<bool>,
    pub notify_reminders: Option<bool>,
    pub notify_updates: Option<bool>,
    pub notify_alerts: Option<bool>,
    pub notify_activity: Option<bool>,
}

/// Diesel changeset for updating settings
/// Uses i32 for boolean fields (SQLite compatibility)
#[derive(Debug, AsChangeset)]
#[diesel(table_name = settings)]
pub struct SettingsChangeset {
    pub theme: Option<String>,
    pub sidebar_expanded: Option<i32>,
    pub show_in_tray: Option<i32>,
    pub launch_at_login: Option<i32>,
    pub enable_logging: Option<i32>,
    pub log_level: Option<String>,
    pub enable_notifications: Option<i32>,
    pub notify_general: Option<i32>,
    pub notify_reminders: Option<i32>,
    pub notify_updates: Option<i32>,
    pub notify_alerts: Option<i32>,
    pub notify_activity: Option<i32>,
}

impl From<SettingsUpdate> for SettingsChangeset {
    fn from(update: SettingsUpdate) -> Self {
        Self {
            theme: update.theme.map(|t| t.as_str().to_string()),
            sidebar_expanded: update.sidebar_expanded.map(bool_to_int),
            show_in_tray: update.show_in_tray.map(bool_to_int),
            launch_at_login: update.launch_at_login.map(bool_to_int),
            enable_logging: update.enable_logging.map(bool_to_int),
            log_level: update.log_level.map(|l| l.as_str().to_string()),
            enable_notifications: update.enable_notifications.map(bool_to_int),
            notify_general: update.notify_general.map(bool_to_int),
            notify_reminders: update.notify_reminders.map(bool_to_int),
            notify_updates: update.notify_updates.map(bool_to_int),
            notify_alerts: update.notify_alerts.map(bool_to_int),
            notify_activity: update.notify_activity.map(bool_to_int),
        }
    }
}
