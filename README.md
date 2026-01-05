# Podman Desktop Navigation Bar Prototype

[![CI](https://github.com/vancura/podman-desktop-navbar-proto/actions/workflows/ci.yml/badge.svg)](https://github.com/vancura/podman-desktop-navbar-proto/actions/workflows/ci.yml)
[![License](https://img.shields.io/badge/license-ISC-blue.svg)](./LICENSE)

> **⚠️ Important: This is a functional prototype, not a high-fidelity design.**
>
> All visuals (spacing, colors, icon sizes and icon glyphs themselves, item counts) are approximate and subject to
> change. The Podman Desktop design team will create the final high-fidelity design.
>
> **This prototype exists solely to validate interaction patterns and UX decisions**.

A comprehensive interactive prototype exploring the next-generation navigation bar design for
[Podman Desktop](https://podman-desktop.io/). Built with Svelte 5, Tailwind CSS v4, and TypeScript by
[@vancura](https://github.com/vancura/).

- See the prototype at https://podman-desktop-navbar-proto.vancura.dev or pull the repo and install via `pnpm`.
- GitHub issue and discussion: https://github.com/podman-desktop/podman-desktop/issues/6774

---

## Focus

This prototype answers “Does this navigation model work?” before investing in pixel-perfect design.

### What This Prototype IS

- ✅ **A functional proof-of-concept**: Working implementation of complex navigation patterns.
- ✅ **A UX validation tool**: Tests interactions, state management, and edge cases.
- ✅ **A technical exploration**: Validates UX, i18n strategy, responsive design.
- ✅ **A discussion starter**: A tangible artifact for gathering feedback on navigation patterns.

### What This Prototype IS NOT

- ❌ **Not high-fidelity visual design**: Colors, spacing, icons, and font sizes are exploratory placeholders.
- ❌ **Not final design metrics**: The team will refine distances, icon counts, panel sizes.
- ❌ **Not pixel-perfect**: Visual polish happens during actual Podman Desktop integration.
- ❌ **Not production code**: Built for experimentation, not direct integration.

---

## Phase 1: Core Navigation (Current)

This prototype showcases **Phase 1** of the navigation bar redesign.

### Four-Tier Structure

A hard requirement organizing navigation into distinct zones:

| Section           | Description                                                                      |
| ----------------- |----------------------------------------------------------------------------------|
| **Essentials**    | Core features always on top, cannot be hidden (Containers ⌘1, Images ⌘2).      |
| **Pinned**        | User-customizable section for frequently-used items (max 10, like VSCode/Teams). |
| **Regular Items** | All other navigation items (Pods, Volumes, Kubernetes, etc.)                     |
| **Bottom Panel**  | Account + Settings, always visible, separated by divider.                        |

### Display Modes

Two modes with intelligent switching based on navbar width:

- **icon + title (≥120px)**: Default mode, no tooltips (avoids duplication),
- **icon only (<120px)**: Compact mode, tooltips always shown with keyboard shortcuts.

Resize by dragging the navbar edge. 10px hysteresis prevents flickering.

### Key Features Implemented

| Feature                 | Description                                                                  |
| ----------------------- |------------------------------------------------------------------------------|
| **Pinning**             | Right-click → Pin to Top. Max 10 items. Follows VSCode/Teams gold standard. |
| **Hiding**              | Hide items via context menu. Access hidden items via More button.            |
| **More Button**         | Appears above bottom panel when items are hidden. Click to restore.          |
| **Context Menus**       | Different menus for items, empty space, Settings, and Account.               |
| **Tooltips**            | Context-aware: shown only in icon-only mode, include keyboard shortcuts.     |
| **Scrolling**           | macOS-style scrollbar with fade gradients indicating scrollable content.     |
| **RTL Support**         | Full right-to-left layout for Arabic and Hebrew.                             |
| **Keyboard Navigation** | ⌘1–⌘6 for items, ⌘, for Settings, arrow keys in menus.                    |

### Context Menu Actions

**On navigation items:**

| Action                       | What It Does                                                              |
|------------------------------|---------------------------------------------------------------------------|
| **Pin to Top** / **Unpin**   | Moves item to/from the Pinned section for quick access.                   |
| **Hide From Navigation Bar** | Removes item from view. Restore via More button or "Show Hidden Items".  |
| **Keyboard Shortcut…**       | Opens shortcut assignment dialog (placeholder in prototype).              |
| **Extension Settings**       | Opens the extension's settings page in Podman Desktop Settings.           |
| **Remove Extension**         | Initiates extension uninstall flow.                                       |
| **Configure Navigation Bar** | Opens Navigation Bar settings in Podman Desktop Settings.                 |

**On empty space:**

| Action                        | What It Does                                                    |
|-------------------------------|-----------------------------------------------------------------|
| **Show Icons and Titles**     | Expands navbar to show both icons and text labels.              |
| **Show Icons Only**           | Collapses navbar to compact icon-only mode.                     |
| **Show Hidden Items**         | Submenu listing all hidden items. Click to restore.             |
| **Configure Navigation Bar**  | Opens Navigation Bar settings in Podman Desktop Settings.       |
| **Reset Navigation Bar**      | Restores all items to default state (unpins, unhides all).      |

---

## Phase 2: Drag & Drop (Planned)

Future enhancements for item management:

- **Drag-and-drop reordering**: Reorder items within sections (VSCode-style).
- **Visual feedback**: Drop zones with dashed borders, ghost elements during the drag.
- **Smooth transitions**: 200–300ms animations for a polished feel.
- **Keyboard alternatives**: Full accessibility for reordering.
- **Hide indicators**: "3 Items Hidden" count at the bottom of the navbar.
- **Bulk operations**: Show/hide multiple items via the Settings panel.

### Protection Rules

- Essential items (Containers, Images) cannot be hidden.
- Bottom items (Account, Settings) can’t be hidden or moved.
- Currently active or pinned items can’t be hidden.

---

## Phase 3: Workspaces & Profiles (Future)

Advanced customization for different workflows:

- **Saved profiles**: Different navbar configurations for different tasks.
- **Quick switching**: Dropdown in the navbar header to switch profiles.
- **Collapsible sections**: Custom groupings with drag-drop organization.
- **Built-in presets:**
  - Development: Containers, Pods, Logs
  - Debugging: Containers, Images, Volumes, Network, Logs
  - Deployment: Pods, Services, Kubernetes items
- **Team sharing**: Export/import profile configurations.

---

## Accessibility & Internationalization

### Language Support

- **5 languages**: English, German, Chinese, Arabic, Hebrew.
- **RTL layout**: Full mirroring for Arabic and Hebrew.
- **30–35% expansion planning**: German/Finnish expand significantly.

### Active/Selected States

Multiple indicators ensure accessibility:

- Background color change (10–20% opacity)
- Left border accent (3–5pt solid)
- Title color change
- Filled vs. outline icons
- Focus rings (3:1 contrast, always visible)

### Design Considerations

- **Don’t rely on color alone**: All states have multiple visual indicators.
- **Reduced motion support**: Respects `prefers-reduced-motion`.
- **Zoom up to 200%**: Uses larger icons to prevent blur.
- **Logical properties**: `padding-inline-start` for RTL compatibility.

### Spacing Guidelines (Subject to Final Design)

These values are placeholders for the prototype:

| Element         | Current Value | Notes                        |
| --------------- | ------------- | ---------------------------- |
| Icon size       | 24px          | 20px for dense layout        |
| Hit area        | ≥32×40px      | Desktop-optimized, not touch |
| Section spacing | 16–24px       | Between groups               |
| Icon-title gap  | 8–12px        | Following Fluent guidelines  |

---

## Quick Start

Published prototype: https://podman-desktop-navbar-proto.vancura.dev

```bash
# Prerequisites: Node.js v20+, pnpm v10.24.0+
pnpm install
pnpm dev
```

Open `http://localhost:5173` to explore the prototype.

### Interacting with the Prototype

| Action             | How                                         |
| ------------------ |---------------------------------------------|
| Resize navbar      | Drag the right edge (60–240px)              |
| Pin/hide items     | Right-click → context menu                  |
| Switch modes       | Right-click empty space → Show Icons Only   |
| Change language    | Use control panel buttons on right          |
| Keyboard shortcuts | ⌘1–⌘6, ⌘, for Settings, Esc to close overlays |

> **💡 Tips and Tricks**
>
> - Hold **⌘** to see keyboard shortcuts above navigation bar items.
> - **Right-click** on items or empty space to see context menus with additional actions.
> - **Pin/unpin** and **hide/show** items to customize your navigation bar.

---

## Out of Scope

This prototype intentionally excludes:

- Actual Podman Desktop integration
- Real Settings pages (info banners explain what would happen)
- Keyboard shortcut assignment dialogs
- Extension installation/uninstallation flows
- State persistence (resets on reload)
- Authentication flows

---

## Discussion

Please see the GitHub issue and share your feedback: https://github.com/podman-desktop/podman-desktop/issues/6774

---

## Related Projects

- **[Podman Desktop](https://github.com/containers/podman-desktop)** — The main application

## License

ISC License — Copyright (c) 2025 Václav Vančura. See [LICENSE](./LICENSE).
