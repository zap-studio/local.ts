# Local.ts

A starter kit for building local-first applications for mobile and desktop.

## Features

- **Local-first** — Your data stays on your device, always available offline
- **Cross-platform** — Build for macOS, Windows, Linux, iOS, and Android
- **Lightweight** — Native performance with a small bundle size
- **Secure** — Built-in Content Security Policy and Tauri's security model
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

- If using WebAssembly, add `'wasm-unsafe-eval'` to `script-src`
- See [Tauri CSP documentation](https://tauri.app/security/csp/) for more details

## License

[MIT](LICENSE)
