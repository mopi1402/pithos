/**
 * @module kanon/core/consts/patterns
 *
 * Cached regex patterns for validation
 *
 * Pre-compiled regular expressions used throughout the validation system.
 * Caching these patterns avoids repeated regex compilation and improves performance.
 *
 * @performance Optimization: Cached patterns eliminate regex compilation overhead
 *
 * @note These regex patterns are stricter than the previous versions:
 * - EMAIL_REGEX: Rejects consecutive dots, dots at start/end of local part, invalid domain characters
 * - URL_REGEX: Rejects invalid ports, invalid userinfo, double separators
 *
 * @see RFC 5322 for email address specification
 * @see RFC 3986 for URI specification
 */
/**
 * RFC 5322 compliant email regex (simplified, without quoted strings support).
 * Local part: no consecutive dots, no dot at start/end, allows special chars.
 * Domain: only letters, digits, hyphens (not at start/end of labels), dots.
 *
 * @since 3.0.0
 */
export const EMAIL_REGEX =
  /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)+$/;

/**
 * RFC 3986 compliant URL regex (http/https only, with strict validation).
 * Scheme: http or https only.
 * Authority: optional userinfo, host (domain or IPv4), optional port.
 * Path, query, fragment: standard URI components.
 * Note: Prevents double separators (??, ##) by ensuring query/fragment don't start with their separator.
 *
 * @since 3.0.0
 */
export const URL_REGEX =
  /^https?:\/\/(?:[a-zA-Z0-9._~-]+(?::[a-zA-Z0-9._~-]*)?@)?(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?)*|(?:\d{1,3}\.){3}\d{1,3})(?::[0-9]{1,5})?(?:\/[^\s?#]*)?(?:\?[^\s?#]+)?(?:#[^\s#]+)?$/;

/**
 * UUID regex pattern (versions 1-5).
 *
 * @since 3.0.0
 */
export const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
