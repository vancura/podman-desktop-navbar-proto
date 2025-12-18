/**
 * Menu Navigation Utilities
 * Shared keyboard navigation logic for context menus and popup menus.
 */

/**
 * Navigate to previous item in a circular list.
 * @param currentIndex - Current focused index
 * @param itemCount - Total number of items
 * @returns New index
 */
export function navigatePrevious(currentIndex: number, itemCount: number): number {
    if (itemCount === 0) return -1;
    return currentIndex > 0 ? currentIndex - 1 : itemCount - 1;
}

/**
 * Navigate to next item in a circular list.
 * @param currentIndex - Current focused index
 * @param itemCount - Total number of items
 * @returns New index
 */
export function navigateNext(currentIndex: number, itemCount: number): number {
    if (itemCount === 0) return -1;
    return currentIndex < itemCount - 1 ? currentIndex + 1 : 0;
}

/**
 * Navigate within actionable items only (skipping disabled/separator items).
 * @param direction - Navigation direction
 * @param currentIndex - Current focused index
 * @param actionableIndices - Array of indices that can be focused
 * @returns New index from actionableIndices
 */
export function navigateActionable(
    direction: 'up' | 'down' | 'first' | 'last',
    currentIndex: number,
    actionableIndices: number[],
): number {
    if (actionableIndices.length === 0) return -1;

    const currentPos = actionableIndices.indexOf(currentIndex);

    switch (direction) {
        case 'up':
            if (currentPos > 0) {
                const index = actionableIndices[currentPos - 1];
                if (index !== undefined) return index;
            }
            return actionableIndices[actionableIndices.length - 1] ?? -1;

        case 'down':
            if (currentPos < actionableIndices.length - 1) {
                const index = actionableIndices[currentPos + 1];
                if (index !== undefined) return index;
            }
            return actionableIndices[0] ?? -1;

        case 'first':
            return actionableIndices[0] ?? -1;

        case 'last':
            return actionableIndices[actionableIndices.length - 1] ?? -1;
    }
}

/** Menu keyboard event handler result. */
export type MenuKeyAction = 'close' | 'up' | 'down' | 'first' | 'last' | 'select' | 'none';

/**
 * Determine action from keyboard event.
 * @param key - Keyboard event key
 * @returns Action to perform
 */
export function getMenuKeyAction(key: string): MenuKeyAction {
    switch (key) {
        case 'Escape':
            return 'close';
        case 'ArrowUp':
            return 'up';
        case 'ArrowDown':
            return 'down';
        case 'Home':
            return 'first';
        case 'End':
            return 'last';
        case 'Enter':
        case ' ':
            return 'select';
        default:
            return 'none';
    }
}
