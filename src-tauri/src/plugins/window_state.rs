use tauri::{App, Manager, Runtime, Window};
use tauri_plugin_window_state::{AppHandleExt, StateFlags, WindowExt};

/// Initialize the window state plugin and restore state for all windows
pub fn init<R: Runtime>(app: &App<R>) -> Result<(), Box<dyn std::error::Error>> {
    app.handle()
        .plugin(tauri_plugin_window_state::Builder::default().build())?;

    // Restore window state for all windows
    let windows = app.handle().windows();

    for (_, window) in windows {
        window.restore_state(StateFlags::all())?;
    }

    Ok(())
}

/// Save window state when a window close is requested
pub fn on_close_requested<R: Runtime>(window: &Window<R>) {
    let _ = window.app_handle().save_window_state(StateFlags::all());
}
