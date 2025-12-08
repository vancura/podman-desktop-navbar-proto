/**
 * Utility functions for the Podman Desktop Navigation Bar Prototype.
 */

/**
 * Asserts that a value is defined (not null or undefined).
 * @param value - The value to check.
 * @param message - Error message if assertion fails.
 * @returns The value, guaranteed to be defined.
 */
export function assert<T>(value: T | null | undefined, message: string): T {
    if (value === null || value === undefined) {
        throw new Error(message);
    }

    return value;
}
