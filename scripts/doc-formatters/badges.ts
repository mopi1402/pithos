/**
 * Generates the HTML for a badge component with absolute positioning.
 *
 * @param label - The text label for the badge.
 * @param offset - The offset from the bottom of the parent element.
 * @returns The HTML string for the badge with MDX-compatible style props.
 */
export function getBadgeHtml(label: string, offset: number = 30): string {
    const containerStyle = {
        position: 'absolute',
        top: `calc(100% - ${offset}px)`,
        left: '0px'
    };

    const badgeStyleString = JSON.stringify(badgeStyle);
    const containerStyleString = JSON.stringify(containerStyle);

    return `<span className="doc-badges-container" style={${containerStyleString}}><span title="Type: ${label}" style={${badgeStyleString}}>${label}</span></span>`;
}

/**
 * Generates the HTML for an inline badge component (no absolute positioning).
 *
 * @param label - The text label for the badge.
 * @returns The HTML string for the inline badge with MDX-compatible style props.
 */
export function getInlineBadgeHtml(label: string): string {
    const badgeStyleString = JSON.stringify(badgeStyle);

    return `<span title="Type: ${label}" style={${badgeStyleString}}>${label}</span>`;
}

const badgeStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.125rem 0.5rem',
    backgroundColor: 'transparent',
    color: 'rgb(102, 102, 102)',
    border: '1px solid rgb(102, 102, 102)',
    borderRadius: '0.375rem',
    fontSize: '0.575rem',
    fontWeight: '600',
    position: 'relative',
    bottom: '20px'
};
