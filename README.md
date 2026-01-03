# Local.ts

A starter kit for building local-first applications for mobile and desktop.

## Features

- **Local-first** — Your data stays on your device, always available offline
- **Cross-platform** — Build for macOS, Windows, Linux, iOS, and Android
- **Lightweight** — Native performance with a small bundle size
- **Secure** — Built-in Content Security Policy and Tauri's security model
- **Splash Screen** — Elegant loading screen while app initializes
- **App Settings** — Persistent settings with theme, behavior, and developer options
- **System Tray** — Built-in system tray with show/hide and quit actions
- **Autostart** — Launch at login with user-configurable settings
- **Window State** — Remembers window size and position across app restarts
- **Logging** — Configurable logging to console, webview, and log files
- **Notifications** — Native notifications with customizable channels and permissions
- **SQLite Database** — Diesel ORM with migrations and Tauri commands
- **Modern stack** — React, TypeScript, Vite, Tauri, and Turborepo

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Diesel CLI](https://diesel.rs/guides/getting-started) (for database migrations)

  ```bash
  cargo install diesel_cli --no-default-features --features sqlite
  ```

### Installation

```bash
pnpm install
```

## Customizing Your App

After cloning this starter kit, update the following files to match your project:

### Project Identity

| File                        | Fields to Update                            |
| --------------------------- | ------------------------------------------- |
| `package.json`              | `name`, `version`, `description`            |
| `index.html`                | `title`                                     |
| `src/constants/index.ts`    | `APP_TITLE`                                 |
| `src-tauri/Cargo.toml`      | `name`, `version`, `description`, `authors` |
| `src-tauri/tauri.conf.json` | `productName`, `version`, `identifier`      |
| `splash.html`               | `title` (app name), `description` text      |

### Windows Configuration

The app's window configuration is defined in `src-tauri/tauri.conf.json` under `app.windows`. This starter includes two windows:

**Main Window:**

```json
{
  "title": "Local.ts",
  "label": "main",
  "visible": false,    // Hidden on startup (splash screen shows first)
  "width": 1280,
  "height": 720
}
```

**Splash Screen Window:**

```json
{
  "title": "Loading...",
  "label": "splashscreen",
  "url": "splash.html",
  "width": 1280,
  "height": 720
}
```

The splash screen displays while the app initializes, then automatically closes to reveal the main window. See the [Splash Screen](#splash-screen) section for details.

You can customize window properties like size, position, decorations, and more. See the [Tauri Window Configuration documentation](https://tauri.app/reference/config/#windowconfig) for all available options.

### Sidebar Navigation

Customize the sidebar navigation items by editing `src/constants/sidebar.ts`:

```typescript
import { Home, Settings } from "lucide-react";

import type { SidebarItem } from "@/components/sidebar";

// Top navigation items in the sidebar
export const SIDEBAR_TOP_ITEMS: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/" },
];

// Bottom navigation items in the sidebar
export const SIDEBAR_BOTTOM_ITEMS: SidebarItem[] = [
  { icon: Settings, label: "Settings", href: "/settings" },
];
```

Each `SidebarItem` has:

- `icon` — A Lucide React icon component
- `label` — Display name for the item
- `href` — Route path (must match a route in `src/routes/`)

### App Icons

Replace the default icons with your own:

1. **Tauri icons** — Follow the [Tauri Icon Guide](https://tauri.app/develop/icons/) to generate icons for all platforms. Place them in `src-tauri/icons/`.

2. **Web icons** — Update the favicon and any icons in the `public/` directory. See the [Vite Static Assets Guide](https://vite.dev/guide/assets.html#the-public-directory) for details.

## Extending Your App

For additional functionality like notifications, clipboard access, file dialogs, global shortcuts, and more, check out the official [Tauri Plugins](https://tauri.app/plugin/).

For comprehensive documentation on building with Tauri, visit the [Tauri Documentation](https://tauri.app/learn/).

## System Tray

This starter kit comes with a system tray pre-configured, allowing your app to run in the background — a common requirement for most desktop applications. Users can toggle tray visibility from the Settings page.

### What's Included

The system tray is implemented in `src-tauri/src/system_tray.rs` and provides:

- **App icon** in the system tray using your app's default icon
- **Right-click menu** with:
  - **Show** — Brings the main window to focus
  - **Hide** — Hides the main window
  - **Quit** — Exits the application
- **Left-click behavior** — Clicking the tray icon shows and focuses the main window
- **Settings integration** — Tray visibility is controlled via the Settings page and persisted in the database

### Removing the System Tray

If you don't need system tray functionality, you can remove it:

1. **Delete the system tray module**: Remove `src-tauri/src/system_tray.rs`

2. **Remove the tray-icon feature** from `src-tauri/Cargo.toml`:

   ```diff
   - tauri = { version = "2", features = ["tray-icon"] }
   + tauri = { version = "2", features = [] }
   ```

3. **Remove the module and setup call** from `src-tauri/src/lib.rs`:

   ```rust
   #[cfg_attr(mobile, tauri::mobile_entry_point)]
   pub fn run() {
       tauri::Builder::default()
           .plugin(tauri_plugin_opener::init())
           .run(tauri::generate_context!())
           .expect("error while running tauri application");
   }
   ```

For more details on system tray customization, see the [Tauri System Tray documentation](https://tauri.app/learn/system-tray/).

## Autostart

This starter kit includes autostart functionality, allowing your app to launch automatically when the user logs in. Users can enable or disable this from the Settings page.

### What's Included

The autostart feature uses the [Tauri Autostart Plugin](https://tauri.app/plugin/autostart/) and provides:

- **Launch at login** — Automatically start the app when the user logs into their system
- **Settings integration** — Toggle autostart from the Settings page
- **Cross-platform support** — Works on macOS, Windows, and Linux

### Usage from JavaScript

```typescript
import {
  enable,
  disable,
  isEnabled,
} from '@tauri-apps/plugin-autostart';

// Enable autostart
await enable();

// Check if autostart is enabled
const enabled = await isEnabled();

// Disable autostart
await disable();
```

### Removing Autostart

If you don't need autostart functionality:

1. **Remove the plugin initialization** from `src-tauri/src/lib.rs`:

   ```diff
   - // Initialize autostart plugin
   - #[cfg(desktop)]
   - app.handle().plugin(tauri_plugin_autostart::init(
   -     tauri_plugin_autostart::MacosLauncher::LaunchAgent,
   -     None,
   - ))?;
   ```

2. **Remove the dependency** from `src-tauri/Cargo.toml`:

   ```diff
   - [target.'cfg(any(target_os = "macos", target_os = "windows", target_os = "linux"))'.dependencies]
   - tauri-plugin-autostart = "2"
   ```

3. **Remove the permissions** from `src-tauri/capabilities/default.json`:

   ```diff
   - "autostart:allow-enable",
   - "autostart:allow-disable",
   - "autostart:allow-is-enabled"
   ```

4. **Remove the JavaScript package**:

   ```bash
   pnpm remove @tauri-apps/plugin-autostart
   ```

5. **Update the Settings page** in `src/routes/settings.tsx` to remove the "Launch at Login" setting.

For more details, see the [Tauri Autostart documentation](https://tauri.app/plugin/autostart/).

## Logging

This starter kit includes built-in logging capabilities, essential for debugging and monitoring your application.

### What's Included

The logging module is implemented in `src-tauri/src/logging.rs` and provides:

- **Console output** — Logs printed to stdout for development
- **Webview console** — Rust logs forwarded to the browser devtools
- **Persistent log files** — Logs saved to the app's log directory with automatic rotation

Log files are stored in the platform-specific log directory:

| Platform | Location                                                |
| -------- | ------------------------------------------------------- |
| Linux    | `~/.local/share/{bundleIdentifier}/logs`                |
| macOS    | `~/Library/Logs/{bundleIdentifier}`                     |
| Windows  | `C:\Users\{User}\AppData\Local\{bundleIdentifier}\logs` |

### Usage from JavaScript

```typescript
import { trace, debug, info, warn, error, attachConsole } from '@tauri-apps/plugin-log';

// Attach console to see Rust logs in browser devtools
const detach = await attachConsole();

// Log from JavaScript
info('User logged in');
warn('Connection slow');
error('Failed to save data');
```

### Usage from Rust

```rust
log::info!("Application started");
log::debug!("Processing {} items", count);
log::error!("Failed to connect: {}", err);
```

### Removing Logging

If you don't need logging functionality, you can remove it:

1. **Delete the logging module**: Remove `src-tauri/src/logging.rs`

2. **Remove the dependency** from `src-tauri/Cargo.toml`:

   ```diff
   - tauri-plugin-log = "2"
   - log = "0.4"
   ```

3. **Remove the plugin and module** from `src-tauri/src/lib.rs`:

   ```diff
   - mod logging;

     .plugin(tauri_plugin_opener::init())
   - .plugin(logging::build().build())
     .setup(|app| {
   -     logging::init(app);
         system_tray::setup(app)?;
   ```

4. **Remove the permission** from `src-tauri/capabilities/default.json`:

   ```diff
   - "log:default"
   ```

5. **Remove the JavaScript package**:

   ```bash
   pnpm remove @tauri-apps/plugin-log
   ```

For more details on logging customization, see the [Tauri Logging documentation](https://tauri.app/plugin/logging/).

## Notifications

This starter kit includes native notification support, allowing your app to send system notifications to users with configurable channels and user preferences.

### What's Included

The notification system uses the [Tauri Notification Plugin](https://tauri.app/plugin/notification/) and provides:

- **Native notifications** — System-level notifications on all platforms
- **Notification channels** — Organized categories with different priority levels
- **User preferences** — Per-channel toggle controls in Settings
- **Permission handling** — Automatic permission requests and status checking

### Default Channels

| Channel      | Description                                   | Importance | Default |
| ------------ | --------------------------------------------- | ---------- | ------- |
| **General**  | App announcements, tips, and feature updates  | Default    | On      |
| **Reminders**| Time-sensitive reminders and scheduled tasks  | High       | On      |
| **Updates**  | App updates and version announcements         | Low        | On      |
| **Alerts**   | Critical system alerts and security warnings  | High       | On      |
| **Activity** | Background task progress and sync status      | Min        | Off     |

### Usage from JavaScript

```typescript
import { notify, notifyForced } from '@/lib/tauri/notifications';
import { useSettings } from '@/stores/settings';

// Get current settings
const settings = useSettings.getState().settings;

// Send a notification (respects user preferences)
await notify({
  title: 'Task Complete',
  body: 'Your export has finished',
  channel: 'activity',
}, settings);

// Send a critical notification (bypasses channel settings)
await notifyForced({
  title: 'Security Alert',
  body: 'Unusual activity detected',
  channel: 'alerts',
});
```

### Permission Handling

```typescript
import {
  checkNotificationPermission,
  requestNotificationPermission,
  ensureNotificationPermission,
} from '@/lib/tauri/notifications';

// Check if permission is granted
const hasPermission = await checkNotificationPermission();

// Request permission from the user
const granted = await requestNotificationPermission();

// Check and request if needed (recommended)
const ready = await ensureNotificationPermission();
```

### Channel Management

```typescript
import {
  initializeNotificationChannels,
  getNotificationChannels,
  deleteNotificationChannel,
} from '@/lib/tauri/notifications';

// Initialize all channels (called automatically on app startup)
await initializeNotificationChannels();

// List existing channels
const channels = await getNotificationChannels();

// Remove a channel
await deleteNotificationChannel('activity');
```

### Adding New Channels

To add a new notification channel:

1. **Add the channel type** in `src/lib/tauri/settings/types.ts`:

   ```typescript
   export type NotificationChannel =
     | 'general'
     | 'reminders'
     | 'updates'
     | 'alerts'
     | 'activity'
     | 'my-channel'; // Add your channel
   ```

2. **Add the channel definition** in `src/lib/tauri/notifications/channels.ts`:

   ```typescript
   {
     id: 'my-channel',
     name: 'My Channel',
     description: 'Description of your channel',
     importance: Importance.Default,
     visibility: Visibility.Public,
   },
   ```

3. **Add the settings constant** in `src/constants/settings.ts`:

   ```typescript
   {
     id: 'my-channel',
     name: 'My Channel',
     description: 'Description of your channel',
     settingKey: 'notifyMyChannel',
     defaultEnabled: true,
   },
   ```

4. **Create a database migration** to add the setting column:

   ```bash
   cd src-tauri
   diesel migration generate add_my_channel_notification
   ```

5. **Update all settings types** (TypeScript and Rust) to include the new field.

### Removing Notifications

If you don't need notification functionality:

1. **Remove the plugin** from `src-tauri/src/lib.rs`:

   ```diff
   - .plugin(tauri_plugin_notification::init())
   ```

2. **Remove the dependency** from `src-tauri/Cargo.toml`:

   ```diff
   - tauri-plugin-notification = "2"
   ```

3. **Remove the permissions** from `src-tauri/capabilities/default.json`:

   ```diff
   - "notification:default"
   ```

4. **Remove the JavaScript package**:

   ```bash
   pnpm remove @tauri-apps/plugin-notification
   ```

5. **Delete the notifications module**: Remove `src/lib/tauri/notifications/`

6. **Remove notification settings** from the database migration, Rust models, TypeScript types, and Settings page.

For more details, see the [Tauri Notification documentation](https://tauri.app/plugin/notification/).

## Window State

This starter kit includes window state persistence, which automatically saves and restores window size and position across app restarts — providing a polished desktop experience.

### What's Included

The window-state plugin is initialized in `src-tauri/src/lib.rs` and provides:

- **Automatic persistence** — Window size and position saved on close
- **Automatic restoration** — Previous window state restored on next launch
- **Per-window settings** — Each window's state is tracked independently

### Usage from JavaScript

You can manually save or restore window state if needed:

```typescript
import {
  saveWindowState,
  restoreStateCurrent,
  StateFlags,
} from '@tauri-apps/plugin-window-state';

// Save window state manually
saveWindowState(StateFlags.ALL);

// Restore window state manually
restoreStateCurrent(StateFlags.ALL);
```

### Usage from Rust

```rust
use tauri_plugin_window_state::{AppHandleExt, StateFlags};

// Save state of all open windows
app.save_window_state(StateFlags::all());
```

```rust
use tauri_plugin_window_state::{WindowExt, StateFlags};

// Restore a specific window's state
window.restore_state(StateFlags::all());
```

### Removing Window State

If you don't need window state persistence, you can remove it:

1. **Remove the import and plugin initialization** from `src-tauri/src/lib.rs`:

   ```diff
   - #[cfg(desktop)]
   - use tauri_plugin_window_state::{AppHandleExt, StateFlags};
   ```

   ```diff
   - // Initialize window state plugin
   - #[cfg(desktop)]
   - app.handle()
   -     .plugin(tauri_plugin_window_state::Builder::default().build())?;
   ```

   ```diff
   - .on_window_event(|window, event| {
   -     #[cfg(desktop)]
   -     if let tauri::WindowEvent::CloseRequested { .. } = event {
   -         let _ = window.app_handle().save_window_state(StateFlags::all());
   -     }
   - })
   ```

2. **Remove the dependency** from `src-tauri/Cargo.toml`:

   ```diff
   - tauri-plugin-window-state = "2"
   ```

3. **Remove the permission** from `src-tauri/capabilities/default.json`:

   ```diff
   - "window-state:default"
   ```

4. **Remove the JavaScript package** (if installed):

   ```bash
   pnpm remove @tauri-apps/plugin-window-state
   ```

For more details on window state customization, see the [Tauri Window State documentation](https://tauri.app/plugin/window-state/).

## Splash Screen

This starter kit includes a splash screen that displays while your app initializes — providing a polished user experience and preventing users from seeing an empty window during startup.

### What's Included

The splash screen is configured in `src-tauri/tauri.conf.json` and `splash.html`:

- **Full-screen design** — Clean, minimalist splash screen matching your app's theme
- **Automatic display** — Shows immediately on app launch while main window stays hidden
- **Theme-aware** — Automatically adapts to system light/dark mode preferences
- **Seamless transition** — Closes splash and reveals main window when initialization completes
- **Error handling** — Closes splash even on initialization errors to show error UI

### How It Works

The splash screen uses Tauri's multi-window feature defined in `src-tauri/tauri.conf.json`:

1. **Two windows configured**:
   - `splashscreen` — Full-screen window (1280×720) displaying `splash.html`, visible on launch
   - `main` — Your app window (1280×720), hidden until ready (`visible: false`)

2. **Splash screen** (`splash.html`) — Minimalist HTML with app title and description, styled to match your theme

3. **Initialization flow**:

   ```
   App Launch → Splash shows, Main hidden
                    ↓
   Store Initializer loads settings/theme
                    ↓
   Calls close_splashscreen command (src-tauri/src/commands/window.rs)
                    ↓
   Splash closes → Main window shows and focuses
   ```

4. **Error handling** — If initialization fails, splash still closes to display the error screen

### Customizing the Splash Screen

**Change appearance** — Edit `splash.html`:

```html
<div class="splash-container">
  <h1>Your app name</h1>
  <p>Your app description</p>
</div>
```

The splash uses CSS custom properties from your theme (`src/styles/globals.css`) with automatic light/dark mode support.

**Change window size** — Edit `src-tauri/tauri.conf.json`:

```json
{
  "label": "splashscreen",
  "url": "splash.html",
  "width": 800,     // Adjust as needed
  "height": 600,    // Adjust as needed
  "center": true
}
```

**Add animations or logo** — Modify the `<style>` section in `splash.html` to add:

- Loading spinners
- Fade-in animations
- Your app logo/icon
- Progress indicators

### Removing the Splash Screen

If you don't want a splash screen:

1. **Update `tauri.conf.json`** — Remove splash window and make main visible:

   ```diff
     "windows": [
       {
         "title": "Local.ts",
         "label": "main",
   -     "visible": false,
   +     "visible": true,
         "width": 1280,
         "height": 720
       },
   -   {
   -     "title": "Loading...",
   -     "label": "splashscreen",
   -     "url": "splash.html",
   -     "width": 1280,
   -     "height": 720
   -   }
     ]
   ```

2. **Delete splash file**: Remove `splash.html`

3. **Remove window command**: Delete `src-tauri/src/commands/window.rs`

4. **Update commands module** — Edit `src-tauri/src/commands/mod.rs`:

   ```diff
   pub mod settings;
   - pub mod window;
   ```

5. **Unregister command** — Edit `src-tauri/src/lib.rs`:

   ```diff
   .invoke_handler(tauri::generate_handler![
       commands::settings::get_app_settings,
       commands::settings::update_app_settings,
       commands::settings::set_tray_visible,
   -   commands::window::close_splashscreen,
   ])
   ```

6. **Remove splash logic** — Edit `src/components/store-initializer.tsx`:

   ```diff
   - import { invoke } from "@tauri-apps/api/core";

   useEffect(() => {
     const init = async () => {
       try {
         await initializeSettings();
         initializeTheme();
         setIsInitialized(true);
   -
   -     // Close splash screen and show main window
   -     await invoke("close_splashscreen");
       } catch (err) {
         console.error("Failed to initialize stores:", err);
         setError(err instanceof Error ? err : new Error("Unknown error"));
   -
   -     // Still close splash screen on error to show error UI
   -     await invoke("close_splashscreen").catch(console.error);
       }
     };
   ```

For more details on window configuration, see the [Tauri Window documentation](https://tauri.app/develop/window/).

## App Settings

```diff
- import { invoke } from "@tauri-apps/api/core";

useEffect(() => {
  const init = async () => {
    try {
      await initializeSettings();
      initializeTheme();
      setIsInitialized(true);
-
-     // Close splash screen and show main window
-     await invoke("close_splashscreen");
    } catch (err) {
      console.error("Failed to initialize stores:", err);
      setError(err instanceof Error ? err : new Error("Unknown error"));
-
-     // Still close splash screen on error to show error UI
-     await invoke("close_splashscreen").catch(console.error);
    }
  };
```

For more details on Tauri's multi-window setup, see the [Tauri Window documentation](https://tauri.app/develop/window/).

## Logging

This starter kit includes a complete settings system with a pre-built settings page, persistent storage in SQLite, and theme support out of the box.

### What's Included

The settings system is implemented across the frontend and backend:

- **Settings page** — Pre-built UI at `/settings` with organized sections
- **Theme support** — Light, dark, and system mode with automatic detection
- **Persistent storage** — Settings stored in SQLite and preserved across restarts
- **Type-safe API** — Full TypeScript types matching Rust structs

### Available Settings

| Category       | Setting             | Description                                   | Default  |
| -------------- | ------------------- | --------------------------------------------- | -------- |
| **Appearance** | Theme               | Light, dark, or system color scheme           | `system` |
|                | Sidebar Expanded    | Keep sidebar expanded by default              | `true`   |
| **Behavior**   | Show in System Tray | Show app icon in system tray                  | `true`   |
|                | Launch at Login     | Auto-start with system (via autostart plugin) | `false`  |
| **Developer**  | Enable Logging      | Enable detailed logging                       | `true`   |
|                | Log Level           | Minimum log level to record                   | `info`   |

### Usage from JavaScript

```typescript
import { getSettings, updateSettings } from '@/lib/settings';
import type { Settings, SettingsUpdate } from '@/lib/settings/types';

// Get current settings
const settings: Settings = await getSettings();

// Update a single setting
await updateSettings({ theme: 'dark' });

// Update multiple settings
await updateSettings({
  theme: 'light',
  sidebarExpanded: false,
  enableLogging: true,
});
```

### Using the Theme

The theme store is managed with Zustand and automatically syncs with settings:

```typescript
import { useTheme } from '@/stores/theme';
import { useSettings } from '@/stores/settings';

function MyComponent() {
  const setTheme = useTheme((state) => state.setTheme);
  const theme = useTheme((state) => state.theme);
  const resolvedTheme = useTheme((state) => state.resolvedTheme);

  // theme: 'light' | 'dark' | 'system'
  // resolvedTheme: 'light' | 'dark' (actual applied theme)

  return (
    <button onClick={() => setTheme('dark')}>
      Switch to Dark Mode
    </button>
  );
}
```

### Adding New Settings

To add a new setting:

1. **Generate a new migration**:

   ```bash
   cd src-tauri
   diesel migration generate add_my_setting
   ```

2. **Write the SQL** in the generated `up.sql`:

   ```sql
   ALTER TABLE settings ADD COLUMN my_setting INTEGER NOT NULL DEFAULT 0;
   ```

3. **Write the rollback** in `down.sql`:

   ```sql
   ALTER TABLE settings DROP COLUMN my_setting;
   ```

4. **Run the migration** to apply it and regenerate `schema.rs`:

   ```bash
   diesel migration run
   ```

   The schema will be automatically updated with the new column.

5. **Update the Rust models** in `src-tauri/src/database/models/settings.rs`:
   - Add field to `SettingsRow`, `Settings`, `SettingsUpdate`, and `SettingsChangeset`

6. **Update the TypeScript types** in `src/lib/settings/types.ts`:

   ```typescript
   export interface Settings {
     // ... existing fields
     mySetting: boolean;
   }
   ```

7. **Add UI control** in `src/routes/settings.tsx`

### Project Structure

```
src-tauri/
├── migrations/
│   └── 2026-01-03-120114_create_settings/
│       ├── up.sql           # Creates settings table
│       └── down.sql         # Drops settings table
└── src/database/models/
    └── settings.rs          # Settings model and CRUD operations

src/
├── lib/
│   └── settings/
│       ├── index.ts         # API functions for settings
│       └── types.ts         # TypeScript types
├── stores/
│   ├── settings.ts          # Settings Zustand store
│   └── theme.ts             # Theme Zustand store
├── components/
│   └── store-initializer.tsx # Store initialization wrapper
└── routes/
    └── settings.tsx         # Settings page UI
```

### State Management

This starter uses [Zustand](https://zustand.docs.pmnd.rs) for state management - a lightweight, unopinionated state management solution with no boilerplate.

**Benefits:**

- No React Context providers needed
- Direct store access outside React components
- Built-in selector optimization
- Minimal bundle size (~1kb)

**Example usage:**

```typescript
import { useSettings } from '@/stores/settings';

// Select specific state slices (optimized re-renders)
const settings = useSettings((state) => state.settings);
const updateSettings = useSettings((state) => state.updateSettings);

// Access store outside React
import { useSettings } from '@/stores/settings';
const currentSettings = useSettings.getState().settings;
```

## SQLite Database

This starter kit includes SQLite database support using [Diesel ORM](https://diesel.rs/) — a safe, extensible ORM and query builder for Rust. Database operations are performed on the Rust side and exposed to JavaScript via Tauri commands.

### What's Included

The database module is implemented in `src-tauri/src/database/` and provides:

- **Diesel ORM** — Type-safe database queries with compile-time verification
- **Connection pooling** — Efficient connection management using r2d2
- **Automatic migration runner** — Pending migrations are executed automatically on app startup
- **Model-based structure** — Organized by domain models, each with their own commands

### What You Write vs What's Automatic

| Task                                          | Manual or Automatic?                                           |
| --------------------------------------------- | -------------------------------------------------------------- |
| Writing SQL migrations (`up.sql`, `down.sql`) | **Manual** — You write the SQL                                 |
| Creating migration folders                    | **Automatic** — Generated via `diesel migration generate`      |
| Writing `schema.rs` table definitions         | **Automatic** — Generated via `diesel migration run`           |
| Writing model structs and commands            | **Manual** — You create the Rust code                          |
| Running pending migrations on app startup     | **Automatic** — Diesel handles this                            |
| Tracking which migrations have been applied   | **Automatic** — Diesel uses `__diesel_schema_migrations` table |
| Creating the database file                    | **Automatic** — Created on first run                           |

### How It Works

When your app starts, the database is initialized automatically:

1. **Database file creation** — The SQLite database (`local.db`) is created in the app's data directory if it doesn't exist
2. **Migration embedding** — At compile time, all SQL files from `src-tauri/migrations/` are embedded into the binary
3. **Migration execution** — At runtime, Diesel checks which migrations have been applied and runs any pending ones
4. **Connection pool** — A pool of database connections is created and managed via Tauri's state system

> **Note:** While Diesel CLI generates migration folders and `schema.rs` automatically, you must write the SQL in `up.sql` and `down.sql` yourself. Diesel does not generate SQL for you — it only manages migrations and schema inference.

The database file is stored in the platform-specific app data directory:

| Platform | Location                                              |
| -------- | ----------------------------------------------------- |
| Linux    | `~/.local/share/{bundleIdentifier}/`                  |
| macOS    | `~/Library/Application Support/{bundleIdentifier}/`   |
| Windows  | `C:\Users\{User}\AppData\Roaming\{bundleIdentifier}\` |

### Project Structure

```
src-tauri/
├── migrations/              # Diesel migrations (empty by default)
│   └── .gitkeep
├── src/database/
│   ├── mod.rs               # Pool initialization, migration runner
│   ├── error.rs             # Database error types
│   ├── schema.rs            # Diesel schema (you write this)
│   └── models/
│       ├── mod.rs           # Model exports
│       └── user/            # Example model structure
│           ├── mod.rs       # User struct and module exports
│           └── commands.rs  # Tauri commands for user operations
└── diesel.toml              # Diesel CLI configuration
```

### Creating Migrations

Migrations are SQL files that define your database schema. Diesel CLI helps you generate migration folders automatically with proper timestamps.

Each migration consists of:

- `up.sql` — SQL to apply the migration (CREATE TABLE, ALTER TABLE, etc.)
- `down.sql` — SQL to revert the migration (DROP TABLE, etc.)

Here's how to create your first migration:

1. **Generate a migration** using Diesel CLI:

   ```bash
   cd src-tauri
   diesel migration generate create_users
   ```

   This creates a new directory with a timestamp:

   ```
   migrations/
   └── 2024-01-01-000000_create_users/
       ├── up.sql
       └── down.sql
   ```

2. **Write your SQL** in `up.sql`:

   ```sql
   CREATE TABLE users (
       id INTEGER PRIMARY KEY NOT NULL,
       name TEXT NOT NULL,
       email TEXT NOT NULL UNIQUE,
       created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
   );
   ```

3. **Write the rollback** in `down.sql`:

   ```sql
   DROP TABLE users;
   ```

4. **Run the migration** to apply it and auto-generate `schema.rs`:

   ```bash
   diesel migration run
   ```

   This will:
   - Create the `users` table in your database
   - Automatically generate the table definition in `src-tauri/src/database/schema.rs`:

   ```rust
   diesel::table! {
       users (id) {
           id -> Integer,
           name -> Text,
           email -> Text,
           created_at -> BigInt,
       }
   }
   ```

   > **Note:** Never edit `schema.rs` manually — it's regenerated automatically when you run migrations.

5. **Create the model struct** in `src-tauri/src/database/models/user/mod.rs`:

   ```rust
   pub mod commands;

   use diesel::prelude::*;
   use serde::{Deserialize, Serialize};
   use crate::database::schema::users;

   #[derive(Debug, Clone, Queryable, Selectable, Serialize)]
   #[diesel(table_name = users)]
   pub struct User {
       pub id: i32,
       pub name: String,
       pub email: String,
       pub created_at: i64,
   }

   #[derive(Debug, Clone, Insertable, Deserialize)]
   #[diesel(table_name = users)]
   pub struct NewUser {
       pub name: String,
       pub email: String,
   }
   ```

6. **Create the commands** in `src-tauri/src/database/models/user/commands.rs`:

   ```rust
   use diesel::prelude::*;
   use tauri::State;
   use crate::database::{DbPool, DbError};
   use crate::database::schema::users;
   use super::{User, NewUser};

   #[tauri::command]
   pub fn list_users(pool: State<DbPool>) -> Result<Vec<User>, DbError> {
       let mut conn = pool.get()?;
       users::table.load::<User>(&mut conn).map_err(Into::into)
   }

   #[tauri::command]
   pub fn create_user(pool: State<DbPool>, user: NewUser) -> Result<User, DbError> {
       let mut conn = pool.get()?;
       diesel::insert_into(users::table)
           .values(&user)
           .execute(&mut conn)?;
       users::table.order(users::id.desc()).first(&mut conn).map_err(Into::into)
   }
   ```

7. **Export and register** your model in `lib.rs`:

   ```rust
   .invoke_handler(tauri::generate_handler![
       database::models::user::commands::list_users,
       database::models::user::commands::create_user,
   ])
   ```

### Usage from JavaScript

Once you've created models with Tauri commands, call them using `invoke()`:

```typescript
import { invoke } from '@tauri-apps/api/core';

// Call your custom commands
const users = await invoke('list_users');
```

### When to Create Migrations

Create a new migration when you need to:

- **Add a new table** — Store a new type of data
- **Modify existing tables** — Add/remove columns, change types, add indexes
- **Transform data** — Update existing data in a structured way

Migrations are versioned and run in order. Once a migration has been applied to a user's database, it won't run again. This is tracked automatically by Diesel in a `__diesel_schema_migrations` table.

### Removing the Database

If you don't need database functionality, you can remove it:

1. **Delete the database module and migrations**:
   - Remove `src-tauri/src/database/` directory
   - Remove `src-tauri/migrations/` directory
   - Remove `src-tauri/diesel.toml`

2. **Remove dependencies** from `src-tauri/Cargo.toml`:

   ```diff
   - diesel = { version = "2", features = ["sqlite", "r2d2"] }
   - diesel_migrations = "2"
   - libsqlite3-sys = { version = "0.30", features = ["bundled"] }
   - thiserror = "2"
   ```

3. **Update `src-tauri/src/lib.rs`**:

   ```diff
   - mod database;
   - use tauri::Manager;

     .setup(|app| {
         logging::init(app);
   -
   -     // Initialize database and manage the connection pool
   -     let pool = database::init(app.handle())?;
   -     app.manage(pool);
   -
         system_tray::setup(app)?;
         Ok(())
     })
   ```

For more details on Diesel, see the [Diesel documentation](https://diesel.rs/guides/getting-started). For Tauri commands, see [Calling Rust from the Frontend](https://v2.tauri.app/develop/calling-rust/).

## Auto Updates

For desktop applications, Tauri provides a built-in updater plugin that enables automatic updates with minimal configuration.

The updater supports multiple distribution methods:

- **Static JSON file** — Host update metadata on any static file server
- **Dynamic endpoint** — Use a server that determines updates based on current version
- **GitHub Releases** — Integrate with GitHub's release system

To add auto-update functionality to your app, see the [Tauri Updater Plugin documentation](https://tauri.app/plugin/updater/).

## Turborepo

Use `turbo` commands to execute tasks across all projects in the workspace.

You need to install `turbo` globally using the following command:

```bash
npm install -g turbo
# or
pnpm install -g turbo
```

### Available Commands

- `turbo run build`: Build all projects in the workspace.
- `turbo run check`: Check all projects in the workspace.
- `turbo run dev`: Start a development server for all projects in the workspace.
- `turbo run format`: Format all projects in the workspace.
- `turbo run lint`: Lint all projects in the workspace.
- `turbo run tauri -- *`: Use tauri commands for all projects in the workspace.
- `turbo run test`: Run tests for all projects in the workspace.
- `turbo run test:coverage`: Run tests with coverage for all projects in the workspace.
- `turbo run test:ui`: Run tests with UI for all projects in the workspace.
- `turbo run test:watch`: Run tests in watch mode for all projects in the workspace.
- `turbo run validate`: Validate all projects in the workspace.

## Security

### Content Security Policy (CSP)

This app uses a Content Security Policy to mitigate XSS and other web-based vulnerabilities. The CSP is configured in `src-tauri/tauri.conf.json` under `app.security.csp`.

Current policy:

| Directive     | Value                                                 |
| ------------- | ----------------------------------------------------- |
| `default-src` | `'self' customprotocol: asset:`                       |
| `connect-src` | `ipc: http://ipc.localhost`                           |
| `font-src`    | `'self' https://fonts.gstatic.com`                    |
| `img-src`     | `'self' asset: http://asset.localhost blob: data:`    |
| `style-src`   | `'unsafe-inline' 'self' https://fonts.googleapis.com` |
| `script-src`  | `'self'`                                              |

**Notes:**

- **Development mode:** The `connect-src` directive only allows `ipc:` and `http://ipc.localhost` by default. If you need to connect to external APIs or a local dev server with hot reload, you may need to add those URLs (e.g., `http://localhost:1420 ws://localhost:1420`) during development. Be sure to remove them for production builds.
- If using WebAssembly, add `'wasm-unsafe-eval'` to `script-src`
- See [Tauri CSP documentation](https://tauri.app/security/csp/) for more details
