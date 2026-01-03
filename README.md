# Local.ts

A starter kit for building local-first applications for mobile and desktop.

## Features

- **Local-first** — Your data stays on your device, always available offline
- **Cross-platform** — Build for macOS, Windows, Linux, iOS, and Android
- **Lightweight** — Native performance with a small bundle size
- **Secure** — Built-in Content Security Policy and Tauri's security model
- **System Tray** — Built-in system tray with show/hide and quit actions
- **Window State** — Remembers window size and position across app restarts
- **Logging** — Configurable logging to console, webview, and log files
- **SQLite Database** — Diesel ORM with migrations and Tauri commands
- **Modern stack** — React, TypeScript, Vite, Tauri, and Turborepo

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Rust](https://www.rust-lang.org/tools/install)

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

### App Icons

Replace the default icons with your own:

1. **Tauri icons** — Follow the [Tauri Icon Guide](https://tauri.app/develop/icons/) to generate icons for all platforms. Place them in `src-tauri/icons/`.

2. **Web icons** — Update the favicon and any icons in the `public/` directory. See the [Vite Static Assets Guide](https://vite.dev/guide/assets.html#the-public-directory) for details.

## Extending Your App

For additional functionality like notifications, clipboard access, file dialogs, global shortcuts, and more, check out the official [Tauri Plugins](https://tauri.app/plugin/).

For comprehensive documentation on building with Tauri, visit the [Tauri Documentation](https://tauri.app/learn/).

## System Tray

This starter kit comes with a system tray pre-configured, allowing your app to run in the background — a common requirement for most desktop applications.

### What's Included

The system tray is implemented in `src-tauri/src/system_tray.rs` and provides:

- **App icon** in the system tray using your app's default icon
- **Right-click menu** with:
  - **Show** — Brings the main window to focus
  - **Hide** — Hides the main window
  - **Quit** — Exits the application
- **Left-click behavior** — Clicking the tray icon shows and focuses the main window

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
| Writing `schema.rs` table definitions         | **Manual** — You write the Diesel table macros                 |
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

> **Note:** You must write the migrations yourself. Diesel does not generate SQL for you — it only runs the migrations you create.

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

Migrations are SQL files that define your database schema. **You must write these yourself** — Diesel does not generate them automatically.

Each migration consists of:

- `up.sql` — SQL to apply the migration (CREATE TABLE, ALTER TABLE, etc.)
- `down.sql` — SQL to revert the migration (DROP TABLE, etc.)

Here's how to create your first migration:

1. **Create a migration directory** in `src-tauri/migrations/`:

   ```
   migrations/
   └── 2024-01-01-000000_create_users/
       ├── up.sql
       └── down.sql
   ```

   The naming convention is `{timestamp}_{description}/`.

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

4. **Add the table definition** to `src-tauri/src/database/schema.rs`:

   This file must be written manually to match your SQL schema:

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
