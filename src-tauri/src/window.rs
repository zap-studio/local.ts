use tauri::{App, TitleBarStyle, WebviewUrl, WebviewWindowBuilder};

/// Sets up the main application window with platform-specific configurations.
///
/// On macOS, this creates a window with a transparent titlebar and custom background color.
/// On other platforms, it creates a standard window.
pub fn setup(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let win_builder = WebviewWindowBuilder::new(app, "main", WebviewUrl::default())
        .title("Local.ts")
        .inner_size(1280.0, 720.0);

    // Set transparent title bar only when building for macOS
    #[cfg(target_os = "macos")]
    let win_builder = win_builder.title_bar_style(TitleBarStyle::Transparent);

    let window = win_builder.build()?;

    // Set background color only when building for macOS
    #[cfg(target_os = "macos")]
    {
        use objc2_app_kit::{NSColor, NSWindow};
        use objc2_foundation::MainThreadMarker;

        let ns_window: *mut std::ffi::c_void = window.ns_window()?;
        let ns_window: &NSWindow = unsafe { &*(ns_window as *const NSWindow) };

        let _mtm = MainThreadMarker::new().expect("must be called from the main thread");

        let bg_color = NSColor::colorWithRed_green_blue_alpha(0.0, 0.0, 0.0, 1.0);
        ns_window.setBackgroundColor(Some(&bg_color));
    }

    // Suppress unused variable warning on non-macOS platforms
    #[cfg(not(target_os = "macos"))]
    let _ = window;

    Ok(())
}
