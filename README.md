# Podman Desktop Navigation Bar Prototype

A comprehensive prototype for the Podman Desktop navigation bar built with Svelte 5, Tailwind CSS, and TypeScript. This
prototype demonstrates a fully-featured navigation bar with resizing, pinning, hiding, context menus, keyboard
navigation, and internationalization support.

## Features

### Core Navigation

- **Four-tier structure** — Essentials, Pinned, Regular items, and Bottom panel (Settings/Account)
- **Resizable width** — Drag the edge to resize between 80pt and 300pt
- **Two display modes** — Icon-only and Icon+Title modes based on navbar width
- **Scrollable content** — Scrollable top panel with fade gradients and macOS-style scrollbar
- **More button** — Shows hidden items when available

### Item Management

- **Pinning** — Pin frequently-used items to a dedicated section (max 10 items)
- **Hiding** — Hide items from the main navigation (accessible via More button)
- **Context menus** — Right-click items for pinning, hiding, keyboard shortcuts, and more
- **Keyboard shortcuts** — Full keyboard navigation with shortcuts (Cmd+1, Cmd+2, etc.)

### User Interface

- **Tooltips** — Context-aware tooltips (shown only in icon-only mode)
- **Context menus** — Rich context menus with submenus and separators
- **Modal dialogs** — For confirmations and feature explanations
- **Info banners** — Non-intrusive notifications for out-of-scope features
- **Window frame** — macOS-style window with title bar, traffic lights, and status bar

### Multi-language Support

- **Multi-language support** — English, German, Chinese, Arabic, and Hebrew
- **RTL support** — Full right-to-left layout for Arabic and Hebrew
- **Locale switching** — Test different languages and text expansion scenarios

### Accessibility

- **Keyboard navigation** — Full keyboard support with focus management
- **Focus indicators** — Clear focus rings for keyboard users
- **ARIA labels** — Proper semantic markup
- **Text truncation** — Handles long translations gracefully

## Prerequisites

- **Node.js** v20 or higher (LTS recommended)
- **pnpm** v10.24.0 or higher

## Quick Start

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open your browser at `http://localhost:5173` to see the navigation bar prototype.

## Scripts

| Command             | Description                                     |
| ------------------- | ----------------------------------------------- |
| `pnpm dev`          | Start dev server with HMR                       |
| `pnpm build`        | Type-check and build for production             |
| `pnpm preview`      | Preview the production build                    |
| `pnpm check`        | Run Svelte type checking                        |
| `pnpm lint`         | Run ESLint                                      |
| `pnpm lint:fix`     | Run ESLint with auto-fix                        |
| `pnpm format`       | Format code with Biome and Prettier             |
| `pnpm format:check` | Check formatting without changes                |
| `pnpm typecheck`    | Run TypeScript type checking                    |
| `pnpm spellcheck`   | Run spell checker                               |
| `pnpm preflight`    | Run all checks (format, lint, typecheck, spell) |
| `pnpm clean`        | Remove dist and cache directories               |

## Project Structure

```text
podman-desktop-navbar-proto/
├── src/
│   ├── main.ts                    # Application entry point
│   ├── App.svelte                 # Root component
│   ├── app.css                    # Global styles
│   └── lib/
│       ├── components/
│       │   ├── controls/          # Control panel and debug buttons
│       │   ├── navbar/            # Navigation bar components
│       │   ├── overlays/          # Context menus, tooltips, modals
│       │   ├── scrollbar/         # Scrollbar fade gradients
│       │   └── window/            # Window frame components
│       ├── i18n/                  # Internationalization
│       │   ├── index.ts           # Translation functions
│       │   └── locales/           # Translation files (en, de, zh, ar, he)
│       ├── state/                 # State management
│       │   ├── app-state.svelte.ts
│       │   ├── nav-items.ts       # Default navigation items
│       │   └── types.ts           # TypeScript types
│       └── utils/                 # Utility functions
│           ├── constants.ts       # Design tokens and constants
│           ├── keyboard.ts        # Keyboard handling
│           └── menu-navigation.ts # Menu navigation logic
├── index.html                     # HTML template
├── package.json
├── tsconfig.json                  # TypeScript configuration
├── vite.config.ts                 # Vite configuration
├── svelte.config.js               # Svelte configuration
├── eslint.config.js               # ESLint flat config
├── prettier.config.js             # Prettier configuration
├── biome.json                     # Biome configuration
├── commitlint.config.js           # Commit message linting
└── PLAN.md                        # Detailed implementation plan
```

## Technologies

- **[Svelte 5](https://svelte.dev/)** — Modern reactive framework with runes
- **[Tailwind CSS v4](https://tailwindcss.com/)** — Utility-first CSS framework
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe JavaScript
- **[Vite](https://vite.dev/)** — Fast build tool with HMR
- **[Biome](https://biomejs.dev/)** — Fast formatter and linter
- **[ESLint](https://eslint.org/)** — Code linting
- **[Prettier](https://prettier.io/)** — Code formatting

## Component Architecture

### Navigation Bar Components

- `Navbar.svelte` — Main navigation container
- `NavbarItem.svelte` — Individual navigation item
- `NavbarDivider.svelte` — Visual separator between sections
- `ResizeHandle.svelte` — Drag handle for resizing navbar width

### Overlay Components

- `ContextMenu.svelte` — Right-click context menu with submenu support
- `Tooltip.svelte` — Hover tooltips with keyboard shortcut display
- `ModalDialog.svelte` — Modal dialogs for confirmations
- `InfoBanner.svelte` — Non-intrusive info banners
- `MoreMenu.svelte` — Dropdown menu for hidden items
- `Backdrop.svelte` — Semi-transparent backdrop for modals

### Window Components

- `WindowFrame.svelte` — Main window container
- `TitleBar.svelte` — macOS-style title bar
- `TrafficLights.svelte` — Window controls (close, minimize, maximize)
- `StatusBar.svelte` — Bottom status bar
- `ContentArea.svelte` — Main content area with control panel

### Control Components

- `ControlPanel.svelte` — Debug/testing control panel
- `ActionButton.svelte` — Reusable action button
- `LocaleSwitcher.svelte` — Language switcher
- `KeyboardShortcutsHelp.svelte` — Keyboard shortcuts reference

## State Management

The application uses Svelte 5 runes for reactive state management:

- `app-state.svelte.ts` — Centralized application state
- Reactive derived values for computed properties
- Actions for state mutations
- Persistent state for navbar width and preferences

## Internationalization

The prototype supports 5 languages:

- **English** (en) — Default
- **German** (de)
- **Chinese** (zh)
- **Arabic** (ar) — RTL
- **Hebrew** (he) — RTL

Translations are managed in `src/lib/i18n/locales/` and automatically handle:

- RTL layout switching
- Platform-specific keyboard shortcut formatting
- Text truncation for long translations

## Keyboard Shortcuts

- `Cmd+1` — Containers
- `Cmd+2` — Images
- `Cmd+3` — Pods
- `Cmd+4` — Kubernetes
- `Cmd+5` — Terminal
- `Cmd+,` — Settings
- `Esc` — Close modals/context menus
- Arrow keys — Navigate items and menus

## Development

The control panel (visible in the content area) provides buttons to test various features:

- Add/remove items
- Pin/unpin items
- Hide/show items
- Switch locales
- View keyboard shortcuts

## License

ISC
