/**
 * Pinned Panel Component
 * Contains user-pinned items. Hidden when empty.
 */

import type { IconMode } from '../../state/app-state.js';
import { NavBarPanel, type RenderContext } from './navbar-panel.js';

/**
 * Pinned Panel
 * Section for user-pinned items (max 10). Hidden when no items are pinned.
 */
export class PinnedPanel extends NavBarPanel {
    constructor() {
        super({
            id: 'pinned',
            canScroll: false,
            showDividerAbove: true,
            showDividerBelow: true,
        });
    }

    /**
     * Calculates the height needed for this panel.
     * Returns 0 if there are no pinned items (panel is hidden).
     * @param displayMode - The display mode.
     * @returns The height in pixels.
     */
    override calculateHeight(displayMode: IconMode): number {
        if (this.items.length === 0) {
            return 0;
        }
        return super.calculateHeight(displayMode);
    }

    /**
     * Checks if the panel should be visible.
     * @returns True if there are pinned items.
     */
    isVisible(): boolean {
        return this.items.length > 0;
    }

    /**
     * Renders the panel only if there are items.
     * @param context - The render context.
     */
    override render(context: RenderContext): void {
        if (!this.isVisible()) {
            this.clear();
            return;
        }
        super.render(context);
    }

    /**
     * Updates the panel only if there are items.
     * @param context - The render context.
     */
    override update(context: RenderContext): void {
        if (!this.isVisible()) {
            this.clear();
            return;
        }
        super.update(context);
    }
}
