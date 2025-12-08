/**
 * Bottom Panel Component
 * Contains Account and Settings items, always visible at the bottom.
 */

import { NavBarPanel } from './navbar-panel.js';

/**
 * Bottom Panel
 * Sticky section at the bottom with Account and Settings.
 * These items cannot be hidden or moved.
 */
export class BottomPanel extends NavBarPanel {
    constructor() {
        super({
            id: 'bottom',
            canScroll: false,
            showDividerAbove: true,
            showDividerBelow: false,
        });
    }
}
