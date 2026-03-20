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

# Run the Tauri shell
vp exec tauri dev
```

### Prerequisites

- [Vite+](https://viteplus.dev/) (`vp`)
- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [pnpm](https://pnpm.io/) (used internally via the root `packageManager`)

## Tooling

- **Install dependencies** — `vp install`
- **Run checks** — `vp check`
- **Run tests** — `vp test`
- **Build** — `vp build`
- **Build the native shell** — `vp exec tauri build`
- **Run a full validation pass** — `vp test && vp check && vp build`
- **Regenerate the route tree manually** — `vp exec tsr generate`

## Project Layout

- **Frontend toolchain** lives in the repository root and is managed with Vite+.
- **Rust/Tauri app** lives in `src-tauri/` and is managed with Cargo/Tauri directly.
- **Normal day-to-day workflows** use direct `vp` commands such as `vp dev`, `vp build`, `vp check`, and `vp test`.
- **TanStack Router** route generation is handled by the Vite plugin during dev/build. `vp exec tsr generate` exists only as a manual recovery/debug escape hatch.

## Documentation

For complete documentation, guides, and API references, visit: **[https://www.zapstudio.dev/local-ts](https://www.zapstudio.dev/local-ts)**

## Tech Stack

- **Frontend** — React 19, TypeScript, TanStack Router, Tailwind CSS
- **Desktop** — Tauri v2 (macOS, Windows, Linux, iOS, Android)
- **Backend** — Rust with Diesel ORM
- **Database** — SQLite
- **Build & Tooling** — Vite+, Vite, pnpm
