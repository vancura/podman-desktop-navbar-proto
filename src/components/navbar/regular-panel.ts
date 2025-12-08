/**
 * Regular Panel Component
 * Contains unpinned navigation items that can be pinned or hidden.
 */

import { NavBarPanel } from './navbar-panel.js';

/**
 * Regular Panel
 * Section for unpinned items. Items can be pinned to move them to the Pinned panel,
 * or hidden to move them to the More button's dropdown.
 */
export class RegularPanel extends NavBarPanel {
    constructor() {
        super({
            id: 'regular',
            canScroll: true,
            showDividerAbove: true,
            showDividerBelow: false,
        });
    }
}
