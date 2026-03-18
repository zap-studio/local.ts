# Local.ts

A starter kit for building local-first applications for desktop and mobile.

## Features

- **Local-first** — Your data stays on your device, always available offline
- **Cross-platform** — Build for macOS, Windows, Linux, iOS, and Android
- **Lightweight** — Native performance with a small bundle size
- **Secure** — Built-in Content Security Policy and Tauri's security model

## Built-in Functionality

- **Settings** — Persistent settings with theme, behavior, and developer options
- **System Tray** — Background operation with show/hide and quit actions
- **Notifications** — Native notifications with permission handling
- **Database** — SQLite with Diesel ORM and automatic migrations
- **Theming** — Light, dark, and system theme modes
- **Logging** — Multi-target logging to console, webview, and files
- **Window State** — Remember window size and position across restarts
- **Autostart** — Launch at login with user-configurable settings
- **Splash Screen** — Elegant loading screen while app initializes

## Quick Start

```bash
# Clone the repository
git clone https://github.com/zap-studio/local.ts.git my-app
cd my-app

# Install dependencies
vp install

# Run in development mode
vp run dev

# Run the Tauri shell
vp run tauri dev
```

### Prerequisites

- [Vite+](https://viteplus.dev/) (`vp`)
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [pnpm](https://pnpm.io/) (used via the root `packageManager`)

## Tooling

- **Install dependencies** — `vp install`
- **Run checks** — `vp run check`
- **Run tests** — `vp run test`
- **Build** — `vp run build`
- **Run validation** — `vp run validate`
- **Run custom cached workflows** — `vp run <task>`

## Project Layout

- **Frontend toolchain** lives in the repository root and is managed with Vite+.
- **Rust/Tauri app** lives in `src-tauri/` and is managed with Cargo/Tauri directly.
- **Normal project entrypoints** are exposed as `package.json` scripts.
- **Vite Task** is used only for workflows that benefit from task dependencies or caching, such as `app:build`, `app:validate`, and `routes`.

## Documentation

For complete documentation, guides, and API references, visit: **[https://www.zapstudio.dev/local-ts](https://www.zapstudio.dev/local-ts)**

## Tech Stack

- **Frontend** — React 19, TypeScript, TanStack Router, Tailwind CSS
- **Desktop** — Tauri v2 (macOS, Windows, Linux, iOS, Android)
- **Backend** — Rust with Diesel ORM
- **Database** — SQLite
- **Build & Tooling** — Vite+, Vite, pnpm
