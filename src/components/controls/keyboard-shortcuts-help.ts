/**
 * Keyboard Shortcuts Help Component
 * Displays a list of keyboard shortcuts in the content area.
 */

import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Shortcut group definition. */
interface ShortcutGroup {
    title: string;
    shortcuts: Array<{ key: string; description: string }>;
}

const HELP_CONFIG = {
    groupGap: 24,
    lineHeight: 18,
    titleMarginBottom: 8,
    keyWidth: 70,
    descriptionX: 80,
} as const;

/** All shortcut groups to display. */
const SHORTCUT_GROUPS: ShortcutGroup[] = [
    {
        title: 'Navigation',
        shortcuts: [
            { key: '⌘1', description: 'Containers' },
            { key: '⌘2', description: 'Images' },
            { key: '⌘3', description: 'Volumes' },
            { key: '⌘4', description: 'Extensions' },
            { key: '⌘0', description: 'Settings' },
            { key: '⌘F12', description: 'Terminal' },
        ],
    },
    {
        title: 'Pinned Items',
        shortcuts: [{ key: '⌘5–9', description: 'Pinned 1–5' }],
    },
    {
        title: 'Focus Navigation',
        shortcuts: [
            { key: '↑ / ↓', description: 'Navigate items' },
            { key: 'Home / End', description: 'First / Last' },
            { key: 'Enter', description: 'Activate item' },
            { key: 'Tab', description: 'Focus next' },
            { key: '⇧Tab', description: 'Focus previous' },
        ],
    },
    {
        title: 'Other',
        shortcuts: [
            { key: '⌘B', description: 'Toggle navbar' },
            { key: 'Esc', description: 'Close overlay' },
        ],
    },
];

/**
 * Creates the keyboard shortcuts help panel.
 * @param x - X position.
 * @param y - Y position.
 * @returns The help group element.
 */
export function createKeyboardShortcutsHelp(x: number, y: number): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'keyboard-shortcuts-help',
        transform: `translate(${x}, ${y})`,
    });

    // Main title
    const mainTitle = createSvgElement('text', {
        x: '0',
        y: '0',
        fill: COLORS.textPrimary,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': '13',
        'font-weight': '600',
    });
    mainTitle.textContent = 'Keyboard Shortcuts';
    group.appendChild(mainTitle);

    let currentY = 24;

    // Render each group
    for (const shortcutGroup of SHORTCUT_GROUPS) {
        // Group title
        const titleElement = createSvgElement('text', {
            x: '0',
            y: String(currentY),
            fill: COLORS.textSecondary,
            'font-family': TYPOGRAPHY.tooltipFontFamily,
            'font-size': '11',
            'font-weight': '600',
        });
        titleElement.textContent = shortcutGroup.title;
        group.appendChild(titleElement);

        currentY += HELP_CONFIG.titleMarginBottom;

        // Shortcuts
        for (const shortcut of shortcutGroup.shortcuts) {
            currentY += HELP_CONFIG.lineHeight;

            // Key
            const keyElement = createSvgElement('text', {
                x: '0',
                y: String(currentY),
                fill: COLORS.textMuted,
                'font-family': 'SF Mono, Menlo, Monaco, monospace',
                'font-size': '11',
                'font-weight': '500',
            });
            keyElement.textContent = shortcut.key;
            group.appendChild(keyElement);

            // Description
            const descElement = createSvgElement('text', {
                x: String(HELP_CONFIG.descriptionX),
                y: String(currentY),
                fill: COLORS.textSecondary,
                'font-family': TYPOGRAPHY.tooltipFontFamily,
                'font-size': '11',
                'font-weight': '400',
            });
            descElement.textContent = shortcut.description;
            group.appendChild(descElement);
        }

        currentY += HELP_CONFIG.groupGap;
    }

    return group;
}

/**
 * Gets the approximate width of the help panel.
 */
export function getKeyboardShortcutsHelpWidth(): number {
    return 180;
}
