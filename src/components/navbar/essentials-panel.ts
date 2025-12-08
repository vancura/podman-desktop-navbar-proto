/**
 * Essentials Panel Component
 * Contains core navigation items (Containers, Images) that are always visible.
 */

import { NavBarPanel } from './navbar-panel.js';

/**
 * Essentials Panel
 * Top section with core items that cannot be hidden or moved.
 */
export class EssentialsPanel extends NavBarPanel {
    constructor() {
        super({
            id: 'essentials',
            canScroll: false,
            showDividerAbove: false,
            showDividerBelow: true,
        });
    }
}
