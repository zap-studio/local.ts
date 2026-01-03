// @generated automatically by Diesel CLI.

diesel::table! {
    settings (id) {
        id -> Integer,
        theme -> Text,
        sidebar_expanded -> Integer,
        show_in_tray -> Integer,
        launch_at_login -> Integer,
        enable_logging -> Integer,
        log_level -> Text,
        enable_notifications -> Integer,
        notify_general -> Integer,
        notify_reminders -> Integer,
        notify_updates -> Integer,
        notify_alerts -> Integer,
        notify_activity -> Integer,
    }
}
