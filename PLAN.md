# Podman Desktop Navigation Bar Prototype Plan

I want you to edit the codebase to implement the new Podman Desktop Navigation Bar prototype. Below, I will explain
everything that needs to be implemented.

First investigate the internet on how Podman Desktop navigation bar works. The navigation bar is the menu on the left
side of the window, vertically fully occupying the window (except for the Podman Desktop title bar and status bar).

Please investigate components in `src` to understand how the prototype currently works, learn from it, and continue
following this approach.

## Requirements

- The overflow handling is critically needed, and needs to be done right
- The bottom panel (Account and Settings items) need to be always visible. They remain docked at the bottom of the
  navbar.
- The top panel (containing all items EXCEPT the ones in the bottom panel) can be vertically scrolled when the navbar
  panel height is shorter than the item container height. The scrollbar is going to be visible only when it's needed.
  More on the scrolling below.
- The content area (in content-area.ts) will be used to put controls/debug buttons to. These buttons will serve in
  controlling the new navigation bar (adding, removing items, and other actions).
- Podman Desktop extensions add items to the navbar. Some extensions could add more than one item.
- Items in the navbar always show a glyph/icon in the middle. This needs to be configurable or random. We'll have a list
  of glyphs somewhere in the repo. The glyphs will be simple SVG icons, preferably Solar Icons. Include the module and
  use it to save space.
- We need to support context menu using right click. Context menu will look like a regular menu, with many items
  vertically stacked. There could be a separator in between, drawing a line instead of text.

## Components

Please create the following components, but be free to alter the list or recommend changes:

- EssentialsPanel (use inheritance of a NavBarPanel)
- BottomPanel (use inheritance of a NavBarPanel)
- PinnedPanel (use inheritance of a NavBarPanel)
- RestOfItemsPanel (use inheritance of a NavBarPanel; figure out a better name than RestOfItemsPanel)
- Button that will be used for navbar actions in the content area
- More Button
- Navigation Bar item in both modes (icon+title / icon)
- Tooltip
- ContextMenu
- ContextMenuItem
- InfoBanner - used to show what would happen in the real application (Podman Desktop) now. Click to hide. There can be
  only one, clicking ANYWHERE hides this, so nothing can be used while the banner is shown. Use a semitransparent full
  screen fader behind the banner, helping with the focus.

## Navbar Actions

These actions will be available as buttons in the content area, and will control the navbar:

- Add a new item
- Hide the last item
- Hide a random item
- Pin a random item
- Unpin all items
- Hide a random item
- Unhide all items

## Scrolling

Styled scrollbar with fade indicators is needed. The scrollbar is a macos-like bar that appears on scroll ony. There are
gradient overlays at top and bottom (fade to transparent) to indicate scrollable content.

## Tooltips

Don't duplicate visible title to the tooltip. When the item mode is set to icon+title, don't show tooltips (to prevent
content duplication).

Show keyboard shortcuts in tooltips.

## Context Menu

The user can right click on any menu item (not the More Button) and a context menu shows. It's possible to hide the
context menu by clicking outside of the menu, or by pressing the Esc key.

The user can hence right-click these items:

- An item
- Empty space
- Settings item
- Account item

NOTE: Configuration of the Navigation Bar is in the Podman Desktop Settings, but outside of the scope of this prototype.
We will show the banner component explaining what _would_ happen.

### Right click on a navigation bar item

Allow to:

- "Pin to Top" / "Unpin" - pin to top pins the item to the Pinned area. If the item (that was clicked) is already in the
  Pinned area, show "Unpin". When a pinned item is unpinned, it gets back to the rest of items group/section.
- "Hide From Navigation Bar" - warning about restoring in Settings - this needs a simple modal window with title, simple
  description, and the secondary button "Don't show again". Text should mention that the settings can be changed in
  Podman Desktop Settings.
- "Keyboard Shortcut..." - shows the shortcut assignment dialog. Show a placeholder modal window explaining what this
  is.
- "Extension Settings" - goes to the settings in Podman Desktop Settings. Show a quick banner in the middle of the
  screen, explaining what's going to happen. Hide on click on the banner
- "Hide Extension" - launches the uninstall flow. Show the banner explaining what would happen now.
- "Configure Navigation Bar" - goes to Navigation Bar settings in Settings. Here in the prototype, show just the banner
  what would happen.

### Right click on empty space in the navigation bar

- "Show Icons and Titles" / "Show Icons Only" - switches between the icon modes
- "Show Hidden Items" - shows a submenu (menu needs to support submenus!) with the list of hidden items. Hidden items
  can be restored by clicking. The "Show Hidden Items" menu item is disabled (semitransparent) when no items are hidden.
- "Configure Navigation Bar" - Shows the banner component explaining what would happen now: the Navigation Bar settings
  would be open in Podman Desktop Settings.
- "Reset Navigation Bar" - resets all customization.

### Right click on the Settings item

- "Settings" - banner showing Settings would be open, similar to elsewhere. This goes to general Podman Desktop Settings
- "Extensions" - banner showing the Podman Desktop Extensions settings panel would show
- "Configure Navigation Bar" - shows the banner that Navigation Bar settings in Settings would open
- "Keyboard Shortcuts" - goes to Keyboard Shortcuts settings in the Settings (basically, everything that shows Podman
  Desktop Settings should show the banner component explaining what's up. Settings are out of the scope of this
  prototype)
- "About Podman Desktop" - banner again

### Right click on the Account item

- "Sign Out" - banner
- "Configure Navigation Bar" - again, Settings, show the banner

## Keyboard shortcuts

See the screenshot.

## Four-tier Structure

This is a hard requirement. We'll have these groups of items in the menu:

1. Essentials - Displayed on top of the navbar. Core features that are always on top and cannot be hidden.
   - Containers (cmd+1)
   - Images (cmd+2)

2. Pinned - User-customizable section for frequently-used extensions. When nothing is pinned, the selection is hidden
   altogether. Unpin items with right click → context menu.

3. Rest of items - Not-pinned items go here. Pin with right click → context menu.

4. Potential "More" button - read more below

5. Bottom panel - Docked at the bottom, sticky, always visible. Contains two items: Account and Settings. Account shows
   a user-like icon/glyph, Settings a gear. Bottom panel is separated from the primary navigation via a visual divider
   (a line). Users expect Settings/Account items in known locations (as currently in Podman Desktop). The bottom panel
   separates frequent actions (on top in Essentials, Pinned, rest of the items) from occasional maintenance items
   (Account and Settings). Account and Settings CAN'T be hidden or moved independently.

## Item Icon Modes

There are two icon modes used on the items in the navigation bar:

- Icon/Glyph + titles
- Icons/Glyph only

It should be possible to collapse navigation bar via edge dragging. Remember to add mouse cursor pointers showing
there's such a feature. Make sure the content area (in content-area.ts) is also resized based on this dragging.
Basically, it should be possible to change the width of the navigation bar, and the items in the navigation bar need to
not only resize, but also react to the current navigation bar width. This will react to dragging navigation bar edge.
There are two major steps that affect the appearance of items inside navigation bar:

- Icon/Glyph + titles
- Icon/Glyph only

Imagine behavior based on the navigation bar width:

- 0pt to 80pt: NO way to resize down to this size, the lower width limit is 140pt. Everything needs to be configurable
  in a meaningful place. See design-tokens.ts, perhaps that's the right place.
- 80pt to 160pt: Icon/glyph only. Icons are centered inside the clickable area/hit area.
- 161pt to 300pt: Icon/Glyph + titles. Icons are still centered in the hit area, but a label with the name is displayed
  below the icon
- 301pt and more: NO way to resize up from 300pt either.

Navigation bar width is hence limited to stay between 80pt and 300pt. Keep the settings configurable, so I can tweak.
Handle dragging gracefully, including the potential esc key pressing. Make sure dragging is clever and makes sure it's
not possible to select something while dragging. Enable selection after dragging is done or cancelled.

### Icon/Glyph + Titles

This must stay default for backwards compatibility and muscle memory. Don't show tooltips in this mode (icon + titles),
they would duplicate item title text. Don't show tooltips above the items in this mode. This follows Docker Desktop,
GitHub Desktop and patterns used in most developer tools.

However, people want to have an option to show mode with just icons and easily switch between these two modes.

### Icon/Glyph Only

ALWAYS show tooltips in icon-only mode (this mode). No titles are displayed besides the icon, so a well polished and
robust tooltip solution is needed.

## Pinning Items

This will work the same way as how VSCode and MS Teams work, it's a gold standard, Make sure this works well.

Pinned items change their appearance:

- They have their own section (Pinned group under Essentials, above the Rest of Items, see description above).
- Limit the count of pinned items, so that people can't pin everything. Allow users to pin 10 items. If there are
  already 10 items pinned, don't allow pinning.

## More Button

This is important to do right, will help with progressive disclosure. There will be a button "More" above the Bottom
Panel, but only when it's needed (there are items marked as "hidden"). Otherwise the More Button is not visible at all.
The More Button appears automatically when there are navigation bar items that are marked as "hidden". Once there are no
"hidden" items, the More Button is not shown.

Users can control what's hidden.

Appearance of the More Button is similar to how usual items look, but since it shows just the title "More", its height
is shorter (no need for an icon). The More Button is stacked to the bottom of the navigation bar, just above the Bottom
area with Settings and Account items.

When the user clicks the More Button, a dropdown (similar to context menu) appears, and shows items that are marked as
"hidden". Users can promote items from the menu (shown on clicking the More Button) to the rest of items in the menu via
clicking these items in the menu. These items won't be in the More Button menu anymore when this happens, the menu needs
to update.

## Accessibility to consider

### Title length problems

We have to plan for 30-35% expansion. When truncation happens, add Tailwind truncate AND show a tooltip. Add buttons to
the content area switching locales (AND translate all strings). Add buttons for English (default, use some visualisation
that this setting is on), German, Japanese (which is shorter). Add Arabic (will switch to RTL, see below). Use this to
show that the navigation bar is localizable. You don't need to translate the banner component, but everything else yes
(navbar items, menus, tooltips, did I forget something?)

Add active/selected state (this is a requirement for keyboard navigation). Add:

- Focus ring around the item
- Allow keyboard navigation in menus
- Don't rely on color only

## RTL

When in RTL mode, switch the polarity of navigation bar and content area. Don't change anything in the content area,
it's just for controlling the repo. But otherwise adjust everything in the navigation bar to be RTL. When clicking any
other than Arabic button in the content area, use LTR.

## Spacing and visual density

- Icon size: 24pt icon size, at least 44pt hit area via padding. 20pt for dense layout (very narrow, the smallest
  breakpoint of the navigation bar horizontal edge dragging).
- Click targets: make this usable. Minimum 32x40pt. We don't need mobile/tablet touch features, Podman Desktop is a
  desktop application. Use 32x40pt for hit areas, or something around this space. We must fit as many items in the
  navbar as possible.

## Questions

- Ask me follow-up questions for anything unclear.
- Are there any other TS components that should be implemented?
- Are there any features I am missing? Any obvious UX issues?
- Check the typos. Make sure features and things are called the same way. Consistency is the key.
- Recommend any actions for the content-area that I forgot about and that may be helpful!
