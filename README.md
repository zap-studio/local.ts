# Local.ts

A starter kit for building local-first applications for mobile and desktop.

## Features

- **Local-first** — Your data stays on your device, always available offline
- **Cross-platform** — Build for macOS, Windows, Linux, iOS, and Android
- **Lightweight** — Native performance with a small bundle size
- **Secure** — Built-in Content Security Policy and Tauri's security model
- **System Tray** — Built-in system tray with show/hide and quit actions
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
