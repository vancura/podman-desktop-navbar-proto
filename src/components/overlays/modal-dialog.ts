/**
 * Modal Dialog Component
 * Confirmation dialog with title, message, checkbox, and buttons.
 */

import { t } from '../../i18n/i18n.js';
import { COLORS, TYPOGRAPHY } from '../../utils/design-tokens.js';
import { createSvgElement } from '../../utils/svg-utils.js';

/** Modal dialog configuration. */
export interface ModalDialogConfig {
    titleKey: string;
    descriptionKey: string;
    showCheckbox: boolean;
    checkboxLabelKey: string | undefined;
    confirmButtonKey: string;
    cancelButtonKey: string | undefined;
    width: number;
    height: number;
}

/** Modal dialog result. */
export interface ModalDialogResult {
    confirmed: boolean;
    checkboxChecked: boolean;
}

const MODAL_CONFIG = {
    maxWidth: 400,
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderRadius: 12,
    titleMarginBottom: 12,
    descriptionLineHeight: 1.5,
    checkboxMarginTop: 16,
    buttonMarginTop: 20,
    buttonHeight: 32,
    buttonPaddingHorizontal: 16,
    buttonGap: 12,
    buttonBorderRadius: 6,
    checkboxSize: 16,
    checkboxGap: 8,
} as const;

/**
 * Creates a modal dialog overlay.
 * @param config - The modal configuration.
 * @param onResult - Callback when the modal is closed.
 * @returns The modal group element.
 */
export function createModalDialog(
    config: ModalDialogConfig,
    onResult: (result: ModalDialogResult) => void,
): SVGGElement {
    const {
        titleKey,
        descriptionKey,
        showCheckbox,
        checkboxLabelKey,
        confirmButtonKey,
        cancelButtonKey,
        width,
        height,
    } = config;

    const title = t(titleKey);
    const description = t(descriptionKey);
    const checkboxLabel = checkboxLabelKey ? t(checkboxLabelKey) : '';
    const confirmText = t(confirmButtonKey);
    const cancelText = cancelButtonKey ? t(cancelButtonKey) : null;

    let checkboxChecked = false;

    // Create main group
    const group = createSvgElement('g', {
        'data-name': 'modal-dialog',
    });

    // Fullscreen overlay background
    const overlay = createSvgElement('rect', {
        x: '0',
        y: '0',
        width: String(width),
        height: String(height),
        fill: COLORS.overlayBackground,
        'data-name': 'modal-overlay',
    });
    group.appendChild(overlay);

    // Calculate modal dimensions
    const modalWidth = Math.min(MODAL_CONFIG.maxWidth, width - 80);
    const modalX = (width - modalWidth) / 2;

    // Estimate height
    const maxCharsPerLine = Math.floor((modalWidth - MODAL_CONFIG.paddingHorizontal * 2) / 7);
    const descLines = wrapText(description, maxCharsPerLine);

    let contentHeight = MODAL_CONFIG.paddingVertical * 2;
    contentHeight += TYPOGRAPHY.bannerTitleFontSize; // Title
    contentHeight += MODAL_CONFIG.titleMarginBottom;
    contentHeight += descLines.length * TYPOGRAPHY.bannerTextFontSize * MODAL_CONFIG.descriptionLineHeight;

    if (showCheckbox) {
        contentHeight += MODAL_CONFIG.checkboxMarginTop;
        contentHeight += MODAL_CONFIG.checkboxSize;
    }

    contentHeight += MODAL_CONFIG.buttonMarginTop;
    contentHeight += MODAL_CONFIG.buttonHeight;

    const modalY = (height - contentHeight) / 2;

    // Modal background
    const modalBg = createSvgElement('rect', {
        x: String(modalX),
        y: String(modalY),
        width: String(modalWidth),
        height: String(contentHeight),
        fill: COLORS.bannerBackground,
        stroke: COLORS.bannerBorder,
        'stroke-width': '1',
        rx: String(MODAL_CONFIG.borderRadius),
        ry: String(MODAL_CONFIG.borderRadius),
    });
    group.appendChild(modalBg);

    // Title
    let currentY = modalY + MODAL_CONFIG.paddingVertical + TYPOGRAPHY.bannerTitleFontSize;
    const titleText = createSvgElement('text', {
        x: String(modalX + MODAL_CONFIG.paddingHorizontal),
        y: String(currentY),
        fill: COLORS.bannerText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.bannerTitleFontSize),
        'font-weight': TYPOGRAPHY.bannerTitleFontWeight,
        'pointer-events': 'none',
    });
    titleText.textContent = title;
    group.appendChild(titleText);

    currentY += MODAL_CONFIG.titleMarginBottom;

    // Description
    descLines.forEach((line) => {
        currentY += TYPOGRAPHY.bannerTextFontSize;
        const lineText = createSvgElement('text', {
            x: String(modalX + MODAL_CONFIG.paddingHorizontal),
            y: String(currentY),
            fill: COLORS.bannerTextSecondary,
            'font-family': TYPOGRAPHY.tooltipFontFamily,
            'font-size': String(TYPOGRAPHY.bannerTextFontSize),
            'font-weight': TYPOGRAPHY.bannerTextFontWeight,
            'pointer-events': 'none',
        });
        lineText.textContent = line;
        group.appendChild(lineText);
        currentY += TYPOGRAPHY.bannerTextFontSize * (MODAL_CONFIG.descriptionLineHeight - 1);
    });

    // Checkbox
    if (showCheckbox) {
        currentY += MODAL_CONFIG.checkboxMarginTop;

        const checkboxGroup = createSvgElement('g', {
            'data-name': 'checkbox',
            cursor: 'pointer',
        });

        // Checkbox background
        const checkboxBg = createSvgElement('rect', {
            x: String(modalX + MODAL_CONFIG.paddingHorizontal),
            y: String(currentY),
            width: String(MODAL_CONFIG.checkboxSize),
            height: String(MODAL_CONFIG.checkboxSize),
            fill: 'transparent',
            stroke: COLORS.buttonBorder,
            'stroke-width': '1',
            rx: '3',
            ry: '3',
            'data-name': 'checkbox-bg',
        });
        checkboxGroup.appendChild(checkboxBg);

        // Checkmark (hidden initially)
        const checkmark = createSvgElement('path', {
            d: 'M4 8l3 3 5-6',
            transform: `translate(${modalX + MODAL_CONFIG.paddingHorizontal + 2}, ${currentY + 2})`,
            fill: 'none',
            stroke: COLORS.buttonText,
            'stroke-width': '2',
            'stroke-linecap': 'round',
            'stroke-linejoin': 'round',
            opacity: '0',
            'data-name': 'checkmark',
        });
        checkboxGroup.appendChild(checkmark);

        // Label
        const checkboxLabelText = createSvgElement('text', {
            x: String(modalX + MODAL_CONFIG.paddingHorizontal + MODAL_CONFIG.checkboxSize + MODAL_CONFIG.checkboxGap),
            y: String(currentY + MODAL_CONFIG.checkboxSize * 0.75),
            fill: COLORS.bannerTextSecondary,
            'font-family': TYPOGRAPHY.tooltipFontFamily,
            'font-size': String(TYPOGRAPHY.bannerTextFontSize),
            'font-weight': TYPOGRAPHY.bannerTextFontWeight,
            'pointer-events': 'none',
        });
        checkboxLabelText.textContent = checkboxLabel;
        checkboxGroup.appendChild(checkboxLabelText);

        // Click handler
        checkboxGroup.addEventListener('click', () => {
            checkboxChecked = !checkboxChecked;
            checkmark.setAttribute('opacity', checkboxChecked ? '1' : '0');
            checkboxBg.setAttribute('fill', checkboxChecked ? COLORS.focusRing : 'transparent');
        });

        group.appendChild(checkboxGroup);
        currentY += MODAL_CONFIG.checkboxSize;
    }

    // Buttons
    currentY += MODAL_CONFIG.buttonMarginTop;

    const buttonsX = modalX + modalWidth - MODAL_CONFIG.paddingHorizontal;

    // Confirm button
    const confirmWidth = measureTextWidth(confirmText) + MODAL_CONFIG.buttonPaddingHorizontal * 2;
    const confirmX = buttonsX - confirmWidth;

    const confirmButton = createButton(confirmX, currentY, confirmWidth, MODAL_CONFIG.buttonHeight, confirmText, true);
    confirmButton.addEventListener('click', () => {
        onResult({ confirmed: true, checkboxChecked });
    });
    group.appendChild(confirmButton);

    // Cancel button (if present)
    if (cancelText) {
        const cancelWidth = measureTextWidth(cancelText) + MODAL_CONFIG.buttonPaddingHorizontal * 2;
        const cancelX = confirmX - MODAL_CONFIG.buttonGap - cancelWidth;

        const cancelButton = createButton(cancelX, currentY, cancelWidth, MODAL_CONFIG.buttonHeight, cancelText, false);
        cancelButton.addEventListener('click', () => {
            onResult({ confirmed: false, checkboxChecked });
        });
        group.appendChild(cancelButton);
    }

    // Escape key handler
    const handleKeyDown = (e: KeyboardEvent): void => {
        if (e.key === 'Escape') {
            document.removeEventListener('keydown', handleKeyDown);
            onResult({ confirmed: false, checkboxChecked });
        }
    };
    document.addEventListener('keydown', handleKeyDown);

    return group;
}

/**
 * Creates a button element.
 */
function createButton(
    x: number,
    y: number,
    width: number,
    height: number,
    text: string,
    isPrimary: boolean,
): SVGGElement {
    const group = createSvgElement('g', {
        'data-name': 'button',
        cursor: 'pointer',
    });

    const bg = createSvgElement('rect', {
        x: String(x),
        y: String(y),
        width: String(width),
        height: String(height),
        fill: isPrimary ? COLORS.buttonBackground : 'transparent',
        stroke: COLORS.buttonBorder,
        'stroke-width': isPrimary ? '0' : '1',
        rx: String(MODAL_CONFIG.buttonBorderRadius),
        ry: String(MODAL_CONFIG.buttonBorderRadius),
        'data-name': 'button-bg',
    });
    group.appendChild(bg);

    const textEl = createSvgElement('text', {
        x: String(x + width / 2),
        y: String(y + height / 2 + TYPOGRAPHY.buttonFontSize * 0.35),
        fill: COLORS.buttonText,
        'font-family': TYPOGRAPHY.tooltipFontFamily,
        'font-size': String(TYPOGRAPHY.buttonFontSize),
        'font-weight': TYPOGRAPHY.buttonFontWeight,
        'text-anchor': 'middle',
        'pointer-events': 'none',
    });
    textEl.textContent = text;
    group.appendChild(textEl);

    // Hover effects
    group.addEventListener('mouseenter', () => {
        bg.setAttribute('fill', isPrimary ? COLORS.buttonBackgroundHover : COLORS.buttonBackground);
    });

    group.addEventListener('mouseleave', () => {
        bg.setAttribute('fill', isPrimary ? COLORS.buttonBackground : 'transparent');
    });

    return group;
}

/**
 * Measures text width.
 */
function measureTextWidth(text: string): number {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.position = 'absolute';
    svg.style.visibility = 'hidden';
    document.body.appendChild(svg);

    const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    textEl.setAttribute('font-size', String(TYPOGRAPHY.buttonFontSize));
    textEl.setAttribute('font-family', TYPOGRAPHY.tooltipFontFamily);
    textEl.textContent = text;
    svg.appendChild(textEl);

    const bbox = textEl.getBBox();
    document.body.removeChild(svg);

    return bbox.width;
}

/**
 * Wraps text into lines.
 */
function wrapText(text: string, maxCharsPerLine: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
        if ((currentLine + ' ' + word).trim().length <= maxCharsPerLine) {
            currentLine = (currentLine + ' ' + word).trim();
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }

    if (currentLine) lines.push(currentLine);

    return lines;
}

/**
 * Modal Dialog Manager
 */
export class ModalDialogManager {
    private container: SVGGElement;
    private currentModal: SVGGElement | null = null;

    constructor(container: SVGGElement) {
        this.container = container;
    }

    /**
     * Shows a modal dialog.
     */
    show(config: ModalDialogConfig): Promise<ModalDialogResult> {
        return new Promise((resolve) => {
            this.hide();

            this.currentModal = createModalDialog(config, (result) => {
                this.hide();
                resolve(result);
            });

            this.container.appendChild(this.currentModal);
        });
    }

    /**
     * Hides the current modal.
     */
    hide(): void {
        if (this.currentModal) {
            this.currentModal.remove();
            this.currentModal = null;
        }
    }

    /**
     * Destroys the manager.
     */
    destroy(): void {
        this.hide();
    }
}
