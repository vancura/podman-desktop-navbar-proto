/**
 * SVG utility functions for creating and manipulating SVG elements.
 */

export const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Creates an SVG element with the specified attributes.
 * @param tag - The SVG element tag name.
 * @param attrs - Attributes to set on the element.
 * @returns The created SVG element.
 */
export function createSvgElement<K extends keyof SVGElementTagNameMap>(
    tag: K,
    attrs: Record<string, string> = {},
): SVGElementTagNameMap[K] {
    const element = document.createElementNS(SVG_NS, tag);

    for (const [key, value] of Object.entries(attrs)) {
        element.setAttribute(key, value);
    }

    return element;
}
