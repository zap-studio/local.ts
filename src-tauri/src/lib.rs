mod database;
mod logging;
mod system_tray;

use tauri::Manager;

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

            system_tray::setup(app)?;
            Ok(())
        })
        // Register your model commands here as you create them:
        // .invoke_handler(tauri::generate_handler![
        //     database::models::user::get_user,
        //     database::models::user::create_user,
        // ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
