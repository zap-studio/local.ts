mod database;
mod logging;
mod system_tray;
mod window;

use tauri::Manager;
#[cfg(desktop)]
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(logging::build().build())
        .setup(|app| {
            logging::init(app);

            // Initialize window state plugin
            #[cfg(desktop)]
            app.handle()
                .plugin(tauri_plugin_window_state::Builder::default().build())?;

            // Initialize database and manage the connection pool
            let pool = database::init(app.handle())?;
            app.manage(pool);

            window::setup(app)?;
            system_tray::setup(app)?;
            Ok(())
        })
        .on_window_event(|window, event| {
            #[cfg(desktop)]
            if let tauri::WindowEvent::CloseRequested { .. } = event {
                let _ = window.app_handle().save_window_state(StateFlags::all());
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
