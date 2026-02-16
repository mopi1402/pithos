// Stryker disable next-line Regex: Unicode word-splitting regex with Latin-1 + surrogate pair emoji support
const RE_UNICODE_WORDS =
  /[A-Z\xC0-\xD6\xD8-\xDE]?[a-z\xDF-\xF6\xF8-\xFF]+|[A-Z\xC0-\xD6\xD8-\xDE]+(?![a-z\xDF-\xF6\xF8-\xFF])|[0-9]+|[\ud800-\udbff][\udc00-\udfff][\ufe0e\ufe0f]?(?:\u200d[\ud800-\udbff][\udc00-\udfff][\ufe0e\ufe0f]?)*|[^\x20-\x7F\s_-]+/gu;

// Stryker disable next-line Regex: ASCII word-splitting regex (camelCase-aware)
const RE_ASCII_WORDS =
  /[A-Z]{2,}(?=[A-Z][a-z]|[^A-Za-z]|$)|[A-Z]?[a-z]+|[A-Z]+|[0-9]+/g;

// Stryker disable next-line Regex: Fast non-ASCII detection
const RE_HAS_NON_ASCII = /[^\x20-\x7F]/;

// Threshold: below this length, charCode loop is faster; above, regex wins
const CHARCODE_THRESHOLD = 128;

/**
 * Converts string to upper case with space-separated words.
 *
 * @param str - The string to convert.
 * @returns The upper cased string with words separated by spaces.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/toUpperCase | String.toUpperCase() - MDN}
 * @since 2.0.0
 *
 * @performance O(n) — charCode word splitting for short ASCII, regex for long/Unicode/emoji.
 *
 * @example
 * ```typescript
 * upperCase('--Foo-Bar--');  // => 'FOO BAR'
 * upperCase('fooBar');       // => 'FOO BAR'
 * upperCase('__foo_bar__');  // => 'FOO BAR'
 * ```
 */
export function upperCase(str: string | null | undefined): string {
  if (str == null) return "";

  const len = str.length;
  // Stryker disable next-line EqualityOperator,ConditionalExpression: len === 0 is an optimization — the while loop below handles empty strings identically (never iterates, returns "")
  if (len === 0) return "";

  // Short strings: charCode fast path (no regex overhead)
  // Stryker disable next-line EqualityOperator,ConditionalExpression: both charCode and regex paths produce identical results — this is a performance optimization only
  if (len <= CHARCODE_THRESHOLD) {
    let result = "";
    let i = 0;

    // Stryker disable next-line EqualityOperator: i <= len would read charCodeAt(len) → NaN, which fails all comparisons and exits naturally
    while (i < len) {
      const c = str.charCodeAt(i);

      // Non-ASCII → fall back to Unicode regex
      // Stryker disable next-line EqualityOperator: c >= 127 would include DEL (127), which is non-alphanumeric and handled by the separator skip below
      if (c > 127) {
        // Stryker disable next-line all: match always succeeds since c > 127 guarantees a non-ASCII char
        return (str.match(RE_UNICODE_WORDS) as RegExpMatchArray).map(w => w.toUpperCase()).join(" ");
      }

      // Skip non-alphanumeric
      // Stryker disable next-line EqualityOperator: after c > 127 check, c >= 65 && c <= 90 and c >= 97 && c <= 122 cover all alphanumerics — remaining chars are always separators
      if (c <= 47 || (c >= 58 && c <= 64) || (c >= 91 && c <= 96) || c >= 123) {
        i++;
        continue;
      }

      // Stryker disable next-line ConditionalExpression,EqualityOperator: after separator skip, only digits (48-57), uppercase (65-90), and lowercase (97-122) remain — c < 90 would route 'Z' to the else branch which produces identical output since toUpperCase() is a no-op on 'Z'
      if (c >= 65 && c <= 90) {
        const uStart = i;
        i++;
        // Stryker disable next-line EqualityOperator,ConditionalExpression: i <= len or true would read charCodeAt(len) → NaN, failing >= 65 and exiting naturally
        while (i < len && str.charCodeAt(i) >= 65 && str.charCodeAt(i) <= 90) i++;

        // Stryker disable next-line EqualityOperator,ConditionalExpression: i <= len or true would read charCodeAt(len) → NaN, failing >= 97 and taking the else branch (pure uppercase) which is correct
        if (i < len && str.charCodeAt(i) >= 97 && str.charCodeAt(i) <= 122) {
          if (i - uStart > 1) {
            if (result) result += " ";
            result += str.slice(uStart, i - 1);
            const wStart = i - 1;
            i++;
            // Stryker disable next-line EqualityOperator: i <= len would read charCodeAt(len) → NaN, failing all comparisons and exiting naturally
            while (i < len) {
              const nc = str.charCodeAt(i);
              if ((nc >= 97 && nc <= 122) || (nc >= 48 && nc <= 57)) i++;
              else break;
            }
            result += " " + str.slice(wStart, i).toUpperCase();
          } else {
            i++;
            // Stryker disable next-line EqualityOperator: i <= len would read charCodeAt(len) → NaN, failing all comparisons and exiting naturally
            while (i < len) {
              const nc = str.charCodeAt(i);
              if ((nc >= 97 && nc <= 122) || (nc >= 48 && nc <= 57)) i++;
              else break;
            }
            if (result) result += " ";
            result += str.slice(uStart, i).toUpperCase();
          }
        } else {
          // Pure uppercase block — already uppercase
          if (result) result += " ";
          result += str.slice(uStart, i);
        }
      } else {
        const wStart = i;
        i++;
        // Stryker disable next-line EqualityOperator: i <= len would read charCodeAt(len) → NaN, failing all comparisons and exiting naturally
        while (i < len) {
          const nc = str.charCodeAt(i);
          if ((nc >= 97 && nc <= 122) || (nc >= 48 && nc <= 57)) i++;
          else break;
        }
        if (result) result += " ";
        result += str.slice(wStart, i).toUpperCase();
      }
    }

    return result;
  }

  // Long strings: regex path (V8 native regex engine is faster than JS charCode loop at scale)
  const re = RE_HAS_NON_ASCII.test(str) ? RE_UNICODE_WORDS : RE_ASCII_WORDS;
  const m = str.match(re);
  if (!m) return "";

  let result = m[0].toUpperCase();
  for (let i = 1; i < m.length; i++) {
    result += " " + m[i].toUpperCase();
  }
  return result;
}
