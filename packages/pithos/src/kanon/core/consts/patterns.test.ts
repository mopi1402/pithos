import { describe, it, expect } from "vitest";
import { it as itProp, fc } from "@fast-check/vitest";
import { EMAIL_REGEX, URL_REGEX, UUID_REGEX } from "./patterns";

describe("EMAIL_REGEX", () => {
  it("should match valid email addresses", () => {
    const valid = [
      "user@example.com",
      "test.email@domain.co.uk",
      "user+tag@example.com",
      "user-name@example.com",
      "user_name@example.com",
      "user123@example.com",
      "123@example.com",
      "user@subdomain.example.com",
      "user@123.123.123.com",
      // RFC 2822/5322: Special characters in local part
      "user!name@example.com",
      "user#tag@example.com",
      "user$money@example.com",
      "user%mod@example.com",
      "user&and@example.com",
      "user'quote@example.com",
      "user*star@example.com",
      "user/slash@example.com",
      "user=equal@example.com",
      "user?question@example.com",
      "user^caret@example.com",
      "user`backtick@example.com",
      "user{brace@example.com",
      "user|pipe@example.com",
      "user}close@example.com",
      "user~tilde@example.com",
      // RFC 2822/5322: Multiple dots in local part (not consecutive)
      "first.middle.last@example.com",
      "a.b.c.d.e@example.com",
      // RFC 2822/5322: Hyphens in domain labels
      "user@sub-domain.example.com",
      "user@example-domain.com",
      "user@a-b-c.example.com",
      // RFC 2822/5322: Single character domain labels
      "user@a.com",
      "user@x.y.z.com",
      // RFC 2822/5322: Numeric domain labels
      "user@123.com",
      "user@example.123",
      // RFC 2822/5322: Long domain labels (up to 63 chars)
      "user@" + "a".repeat(31) + ".com",
      // RFC 2822/5322: Multiple subdomains
      "user@a.b.c.d.example.com",
      "user@level1.level2.level3.example.com",
      // RFC 2822/5322: Combined special characters in local part
      "!def!xyz%abc@example.com",
      "customer/department=shipping@example.com",
      "user+tag+filter@example.com",
      "user%example.com@example.org",
      // RFC 2822/5322: Domain labels with digits
      "user@domain123.com",
      // Note: Domain labels starting with digits are technically valid per RFC,
      // but the current regex requires labels to start with alphanumeric (letter or digit)
      // which is more restrictive but still valid
      // RFC 2822/5322: Long TLDs
      "user@example.museum",
      "user@example.international",
      "user@example.travel",
      // RFC 2822/5322: Complex domain structures
      "user@sub-domain.example-domain.com",
      "user@a1.b2.c3.example.com",
    ];

    valid.forEach((email) => expect(EMAIL_REGEX.test(email)).toBe(true));
  });

  it("should not match invalid email addresses", () => {
    const invalid = [
      "invalid",
      "@example.com",
      "user@",
      "user@example",
      "user @example.com",
      "user@ example.com",
      "user@exam ple.com",
      "",
      "user@@example.com",
      "user@.com",
      "@",
      "user@example..com",
      // RFC 2822/5322: Consecutive dots in local part (now correctly rejected)
      "user..name@example.com",
      "first..last@example.com",
      // RFC 2822/5322: Dot at start/end of local part (now correctly rejected)
      ".user@example.com",
      "user.@example.com",
      // RFC 2822/5322: Domain label starting with dot
      "user@.example.com",
      "user@sub..domain.com", // consecutive dots in domain
      // RFC 2822/5322: Domain label ending with dot
      "user@example.com.",
      "user@sub.domain.com.",
      // RFC 2822/5322: Invalid domain characters (now correctly rejected)
      "user@exam!ple.com", // exclamation in domain
      "user@exam#ple.com", // hash in domain
      "user@exam$ple.com", // dollar in domain
      "user@exam ple.com", // space in domain
      "user@exam@ple.com", // @ in domain
      // RFC 2822/5322: Missing top-level domain
      "user@example",
      "user@subdomain",
      // RFC 2822/5322: Empty local part or domain
      "@example.com",
      "user@",
      // Multiple @ symbols
      "user@@example.com",
      "user@exam@ple.com",
      // RFC 2822/5322: Spaces in local part (not quoted)
      "user name@example.com",
      "user  name@example.com", // multiple spaces
      // RFC 2822/5322: Invalid characters in local part (parentheses, brackets, angle brackets)
      // These are only valid in quoted strings, which the regex doesn't support
      "user(name)@example.com",
      "user<name>@example.com",
      "user[name]@example.com",
      // RFC 2822/5322: Invalid domain characters (now correctly rejected)
      "user@exam ple.com", // space in domain
      "user@exam@ple.com", // @ in domain
      "user@exam!ple.com", // exclamation in domain
      "user@exam#ple.com", // hash in domain
      "user@exam$ple.com", // dollar in domain
      // Security: XSS/injection attempts in local part
      'user"name@example.com', // double quote (should be rejected)
      "user<script>@example.com", // HTML tags
      "user<alert(1)>@example.com", // JavaScript injection attempt
      "user>name@example.com", // HTML tag character
      "user<name@example.com", // HTML tag character
      // Note: Apostrophe (') and ampersand (&) are valid per RFC 5322 in local part,
      // but should be handled carefully in application code to prevent XSS
      // Security: XSS/injection attempts in domain
      'user@"example.com', // quote in domain
      "user@'example.com", // apostrophe in domain
      "user@<script>.com", // HTML tags in domain
      "user@example.com<script>", // HTML tags in domain
      // Note: The regex does not enforce length limits (64 chars per label,
      // 255 chars for full domain) as specified in RFC 2822/5322, as this would
      // require additional validation beyond regex matching
    ];

    invalid.forEach((email) => expect(EMAIL_REGEX.test(email)).toBe(false));
  });

  it("should handle security-sensitive characters (XSS/injection attempts)", () => {
    // These tests document how the regex handles potentially dangerous characters
    // Note: Some characters are valid per RFC but should be sanitized in application code

    // Characters that are correctly rejected
    const rejected = [
      'user"name@example.com', // double quote in local part
      "user<script>@example.com", // HTML tags in local part
      "user<alert(1)>@example.com", // JavaScript injection attempt
      "user>name@example.com", // HTML tag character
      "user<name@example.com", // HTML tag character
      'user@"example.com', // quote in domain
      "user@'example.com", // apostrophe in domain
      "user@<script>.com", // HTML tags in domain
    ];

    rejected.forEach((email) => expect(EMAIL_REGEX.test(email)).toBe(false));

    // Characters that are accepted (valid per RFC but require careful handling)
    const acceptedButRisky = [
      "user'name@example.com", // apostrophe is valid per RFC 5322
      "user&name@example.com", // ampersand is valid per RFC 5322
    ];

    acceptedButRisky.forEach((email) => {
      expect(EMAIL_REGEX.test(email)).toBe(true);
      // Note: These should be sanitized/encoded in application code to prevent XSS
    });
  });
});

describe("URL_REGEX", () => {
  it("should match valid URLs", () => {
    const valid = [
      "http://example.com",
      "https://example.com",
      "https://www.example.com",
      "https://example.com/path",
      "https://example.com/path?query=value",
      "https://example.com/path?query=value&other=123",
      "https://example.com/path#anchor",
      "https://sub.domain.example.com",
      "https://example.com:8080",
      "https://example.com/path/to/resource.html",
      // RFC 3986: Userinfo in authority
      "https://user:pass@example.com",
      "https://user@example.com",
      "https://user:password@example.com/path",
      // RFC 3986: Port numbers
      "https://example.com:443",
      "https://example.com:8080/path",
      "https://example.com:3000",
      "http://example.com:80",
      // RFC 3986: IPv4 addresses as host
      "https://192.168.1.1",
      "https://127.0.0.1:8080",
      "https://10.0.0.1/path",
      // RFC 3986: Complex paths
      "https://example.com/path/to/resource",
      "https://example.com/path/to/resource.html",
      "https://example.com/path/to/nested/resource.json",
      // RFC 3986: Query strings
      "https://example.com/path?key=value",
      "https://example.com/path?key1=value1&key2=value2",
      "https://example.com/path?query=value&other=123&more=data",
      // RFC 3986: Fragments
      "https://example.com/path#section",
      "https://example.com/path#section1",
      // RFC 3986: Combined query and fragment
      "https://example.com/path?query=value#anchor",
      "https://example.com/path/to/resource.html?query=value#anchor",
      // RFC 3986: Root path
      "https://example.com/",
      "http://example.com/",
    ];

    valid.forEach((url) => expect(URL_REGEX.test(url)).toBe(true));
  });

  it("should not match invalid URLs", () => {
    const invalid = [
      "not-a-url",
      "example.com",
      "ftp://example.com",
      "//example.com",
      "http://",
      "https://",
      "",
      "javascript:alert(1)",
      "mailto:user@example.com",
      // RFC 3986: Missing scheme
      "example.com/path",
      "//example.com/path",
      // RFC 3986: Invalid schemes (not http/https)
      "ftp://example.com",
      "file:///path/to/file",
      "ws://example.com",
      "wss://example.com",
      // RFC 3986: Missing host
      "https://",
      "https:///path",
      "http://:8080",
      // RFC 3986: Invalid characters in path (spaces, unencoded)
      "https://example.com/path with spaces",
      "https://example.com/path\nwith\nnewlines",
      // RFC 3986: Invalid IPv6 format (not supported by regex)
      "https://[2001:db8::1]",
      "https://[::1]",
      // RFC 3986: Relative URLs (not absolute)
      "/path/to/resource",
      "./relative/path",
      "../parent/path",
      // RFC 3986: Invalid domain characters
      "https://exam ple.com", // space in domain
      // RFC 3986: Invalid port formats (now correctly rejected)
      "https://example.com:",
      "https://example.com:abc",
      "https://example.com:-1",
      // RFC 3986: Invalid userinfo (now correctly rejected)
      "https://user:pass:extra@example.com",
      "https://@example.com", // empty userinfo
      // RFC 3986: Double separators (now correctly rejected)
      "https://example.com/path??query=value", // double question mark
      "https://example.com/path##fragment", // double hash
      // Security: Dangerous protocols (correctly rejected)
      "javascript:alert(1)",
      "javascript:void(0)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:alert(1)",
      // Security: HTML entities and encoding attempts (correctly rejected)
      "https://example.com/path&#60;script&#62;", // HTML entity encoding
      // Note: The current regex accepts some potentially dangerous characters in
      // paths/queries/fragments (quotes, <, >, &, script tags, etc.) as these are
      // technically valid per RFC 3986 when properly encoded. However, applications
      // should sanitize and validate URL components before use to prevent XSS attacks.
      // The regex focuses on structural validity, not security filtering.
    ];

    invalid.forEach((url) => expect(URL_REGEX.test(url)).toBe(false));
  });

  it("should handle security-sensitive characters (XSS/injection attempts)", () => {
    // These tests document how the regex handles potentially dangerous characters
    // Note: Some characters are valid per RFC 3986 but should be sanitized in application code

    // Dangerous protocols that are correctly rejected
    const rejectedProtocols = [
      "javascript:alert(1)",
      "javascript:void(0)",
      "data:text/html,<script>alert(1)</script>",
      "vbscript:alert(1)",
    ];

    rejectedProtocols.forEach((url) => expect(URL_REGEX.test(url)).toBe(false));

    // Characters in paths/queries/fragments that are accepted but risky
    // These are technically valid per RFC 3986 but should be sanitized
    const acceptedButRisky = [
      'https://example.com/path"onclick=alert(1)', // quote in path
      "https://example.com/path'onclick=alert(1)", // apostrophe in path
      "https://example.com/path<script>alert(1)</script>", // HTML tags in path
      "https://example.com/path<alert(1)>", // JavaScript injection in path
      "https://example.com/path&evil=value", // HTML entity in path
      "https://example.com/path?query=<script>alert(1)</script>", // XSS in query
      'https://example.com/path?query="onclick=alert(1)"', // XSS in query
      "https://example.com/path#<script>alert(1)</script>", // XSS in fragment
      "https://example.com/path#javascript:alert(1)", // javascript: in fragment
      "https://example.com/path%3Cscript%3E", // URL encoded <script>
      "https://example.com/path%22onclick", // URL encoded quote
    ];

    acceptedButRisky.forEach((url) => {
      expect(URL_REGEX.test(url)).toBe(true);
      // Note: These should be sanitized/validated in application code to prevent XSS
      // The regex validates structure, not security. Always sanitize user input!
    });
  });
});

describe("UUID_REGEX", () => {
  it("should match valid UUIDs (v1-v5)", () => {
    const valid = [
      "550e8400-e29b-41d4-a716-446655440000", // v4
      "6ba7b810-9dad-11d1-80b4-00c04fd430c8", // v1
      "6ba7b811-9dad-21d1-80b4-00c04fd430c8", // v2
      "6ba7b812-9dad-31d1-80b4-00c04fd430c8", // v3
      "6ba7b814-9dad-51d1-80b4-00c04fd430c8", // v5
      "AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA", // uppercase
    ];

    valid.forEach((uuid) => expect(UUID_REGEX.test(uuid)).toBe(true));
  });

  it("should not match invalid UUIDs", () => {
    const invalid = [
      "not-a-uuid",
      "550e8400-e29b-41d4-a716",
      "550e8400-e29b-41d4-a716-446655440000-extra",
      "550e8400-e29b-61d4-a716-446655440000", // v6 not supported
      "550e8400-e29b-41d4-c716-446655440000", // invalid variant
      "",
      "550e8400e29b41d4a716446655440000", // no dashes
      "550e8400-e29b-41d4-a716-44665544000g", // invalid char
    ];

    invalid.forEach((uuid) => expect(UUID_REGEX.test(uuid)).toBe(false));
  });
});


// ============================================================================
// [🎯] Specification Tests
// ============================================================================

describe("[🎯] Specification Tests", () => {
  describe("EMAIL_REGEX boundary conditions", () => {
    // Requirements 31.1, 31.2

    it("[🎯] should match valid standard email addresses", () => {
      // Boundary: valid emails - basic format
      expect(EMAIL_REGEX.test("user@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("test@domain.org")).toBe(true);
      expect(EMAIL_REGEX.test("name@company.co.uk")).toBe(true);
    });

    it("[🎯] should match valid emails with special characters in local part", () => {
      // Boundary: valid emails - RFC 5322 special characters
      expect(EMAIL_REGEX.test("user+tag@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user-name@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user_name@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user.name@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user!name@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user#tag@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user$money@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user%mod@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user&and@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user'quote@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user*star@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user/slash@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user=equal@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user?question@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user^caret@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user`backtick@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user{brace@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user|pipe@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user}close@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user~tilde@example.com")).toBe(true);
    });

    it("[🎯] should match valid emails with numeric local parts", () => {
      // Boundary: valid emails - numeric local part
      expect(EMAIL_REGEX.test("123@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user123@example.com")).toBe(true);
      expect(EMAIL_REGEX.test("123user@example.com")).toBe(true);
    });

    it("[🎯] should match valid emails with subdomains", () => {
      // Boundary: valid emails - subdomains
      expect(EMAIL_REGEX.test("user@subdomain.example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user@a.b.c.example.com")).toBe(true);
      expect(EMAIL_REGEX.test("user@sub-domain.example.com")).toBe(true);
    });

    it("[🎯] should not match emails without @ symbol", () => {
      // Boundary: invalid emails - missing @
      expect(EMAIL_REGEX.test("userexample.com")).toBe(false);
      expect(EMAIL_REGEX.test("invalid")).toBe(false);
    });

    it("[🎯] should not match emails without domain", () => {
      // Boundary: invalid emails - missing domain
      expect(EMAIL_REGEX.test("user@")).toBe(false);
      expect(EMAIL_REGEX.test("@")).toBe(false);
    });

    it("[🎯] should not match emails without local part", () => {
      // Boundary: invalid emails - missing local part
      expect(EMAIL_REGEX.test("@example.com")).toBe(false);
    });

    it("[🎯] should not match emails with consecutive dots", () => {
      // Boundary: invalid emails - consecutive dots
      expect(EMAIL_REGEX.test("user..name@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@example..com")).toBe(false);
    });

    it("[🎯] should not match emails with dots at start/end of local part", () => {
      // Boundary: invalid emails - dots at boundaries
      expect(EMAIL_REGEX.test(".user@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("user.@example.com")).toBe(false);
    });

    it("[🎯] should not match emails with spaces", () => {
      // Boundary: invalid emails - spaces
      expect(EMAIL_REGEX.test("user name@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@exam ple.com")).toBe(false);
      expect(EMAIL_REGEX.test(" user@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@example.com ")).toBe(false);
    });

    it("[🎯] should not match emails without TLD", () => {
      // Boundary: invalid emails - missing TLD
      expect(EMAIL_REGEX.test("user@example")).toBe(false);
      expect(EMAIL_REGEX.test("user@localhost")).toBe(false);
    });

    it("[🎯] should not match empty string", () => {
      // Boundary: invalid emails - empty
      expect(EMAIL_REGEX.test("")).toBe(false);
    });

    it("[🎯] should not match emails with multiple @ symbols", () => {
      // Boundary: invalid emails - multiple @
      expect(EMAIL_REGEX.test("user@@example.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@exam@ple.com")).toBe(false);
    });

    it("[🎯] should not match emails with invalid domain characters", () => {
      // Boundary: invalid emails - invalid domain chars
      expect(EMAIL_REGEX.test("user@exam!ple.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@exam#ple.com")).toBe(false);
      expect(EMAIL_REGEX.test("user@exam$ple.com")).toBe(false);
    });
  });

  describe("URL_REGEX boundary conditions", () => {
    // Requirements 31.3, 31.4

    it("[🎯] should match valid HTTP URLs", () => {
      // Boundary: valid URLs - HTTP
      expect(URL_REGEX.test("http://example.com")).toBe(true);
      expect(URL_REGEX.test("http://www.example.com")).toBe(true);
      expect(URL_REGEX.test("http://example.com/")).toBe(true);
    });

    it("[🎯] should match valid HTTPS URLs", () => {
      // Boundary: valid URLs - HTTPS
      expect(URL_REGEX.test("https://example.com")).toBe(true);
      expect(URL_REGEX.test("https://www.example.com")).toBe(true);
      expect(URL_REGEX.test("https://example.com/")).toBe(true);
    });

    it("[🎯] should match valid URLs with paths", () => {
      // Boundary: valid URLs - paths
      expect(URL_REGEX.test("https://example.com/path")).toBe(true);
      expect(URL_REGEX.test("https://example.com/path/to/resource")).toBe(true);
      expect(URL_REGEX.test("https://example.com/path/to/resource.html")).toBe(
        true
      );
    });

    it("[🎯] should match valid URLs with query strings", () => {
      // Boundary: valid URLs - query strings
      expect(URL_REGEX.test("https://example.com?query=value")).toBe(true);
      expect(URL_REGEX.test("https://example.com/path?query=value")).toBe(true);
      expect(
        URL_REGEX.test("https://example.com/path?key1=value1&key2=value2")
      ).toBe(true);
    });

    it("[🎯] should match valid URLs with fragments", () => {
      // Boundary: valid URLs - fragments
      expect(URL_REGEX.test("https://example.com#section")).toBe(true);
      expect(URL_REGEX.test("https://example.com/path#section")).toBe(true);
      expect(URL_REGEX.test("https://example.com/path?query=value#section")).toBe(
        true
      );
    });

    it("[🎯] should match valid URLs with ports", () => {
      // Boundary: valid URLs - ports
      expect(URL_REGEX.test("https://example.com:443")).toBe(true);
      expect(URL_REGEX.test("https://example.com:8080")).toBe(true);
      expect(URL_REGEX.test("http://example.com:80")).toBe(true);
      expect(URL_REGEX.test("https://example.com:3000/path")).toBe(true);
    });

    it("[🎯] should match valid URLs with userinfo", () => {
      // Boundary: valid URLs - userinfo
      expect(URL_REGEX.test("https://user@example.com")).toBe(true);
      expect(URL_REGEX.test("https://user:pass@example.com")).toBe(true);
      expect(URL_REGEX.test("https://user:password@example.com/path")).toBe(true);
    });

    it("[🎯] should match valid URLs with IPv4 addresses", () => {
      // Boundary: valid URLs - IPv4
      expect(URL_REGEX.test("https://192.168.1.1")).toBe(true);
      expect(URL_REGEX.test("https://127.0.0.1:8080")).toBe(true);
      expect(URL_REGEX.test("https://10.0.0.1/path")).toBe(true);
    });

    it("[🎯] should not match URLs without scheme", () => {
      // Boundary: invalid URLs - missing scheme
      expect(URL_REGEX.test("example.com")).toBe(false);
      expect(URL_REGEX.test("www.example.com")).toBe(false);
      expect(URL_REGEX.test("//example.com")).toBe(false);
    });

    it("[🎯] should not match URLs with non-HTTP schemes", () => {
      // Boundary: invalid URLs - non-HTTP schemes
      expect(URL_REGEX.test("ftp://example.com")).toBe(false);
      expect(URL_REGEX.test("file:///path/to/file")).toBe(false);
      expect(URL_REGEX.test("ws://example.com")).toBe(false);
      expect(URL_REGEX.test("wss://example.com")).toBe(false);
      expect(URL_REGEX.test("mailto:user@example.com")).toBe(false);
    });

    it("[🎯] should not match dangerous protocol URLs", () => {
      // Boundary: invalid URLs - dangerous protocols
      expect(URL_REGEX.test("javascript:alert(1)")).toBe(false);
      expect(URL_REGEX.test("javascript:void(0)")).toBe(false);
      expect(URL_REGEX.test("data:text/html,<script>alert(1)</script>")).toBe(
        false
      );
      expect(URL_REGEX.test("vbscript:alert(1)")).toBe(false);
    });

    it("[🎯] should not match URLs without host", () => {
      // Boundary: invalid URLs - missing host
      expect(URL_REGEX.test("https://")).toBe(false);
      expect(URL_REGEX.test("https:///path")).toBe(false);
      expect(URL_REGEX.test("http://")).toBe(false);
    });

    it("[🎯] should not match URLs with invalid ports", () => {
      // Boundary: invalid URLs - invalid ports
      expect(URL_REGEX.test("https://example.com:")).toBe(false);
      expect(URL_REGEX.test("https://example.com:abc")).toBe(false);
      expect(URL_REGEX.test("https://example.com:-1")).toBe(false);
    });

    it("[🎯] should not match URLs with spaces", () => {
      // Boundary: invalid URLs - spaces
      expect(URL_REGEX.test("https://example.com/path with spaces")).toBe(false);
      expect(URL_REGEX.test("https://exam ple.com")).toBe(false);
    });

    it("[🎯] should not match empty string", () => {
      // Boundary: invalid URLs - empty
      expect(URL_REGEX.test("")).toBe(false);
    });

    it("[🎯] should not match relative URLs", () => {
      // Boundary: invalid URLs - relative
      expect(URL_REGEX.test("/path/to/resource")).toBe(false);
      expect(URL_REGEX.test("./relative/path")).toBe(false);
      expect(URL_REGEX.test("../parent/path")).toBe(false);
    });

    it("[🎯] should not match URLs with double separators", () => {
      // Boundary: invalid URLs - double separators
      expect(URL_REGEX.test("https://example.com/path??query=value")).toBe(false);
      expect(URL_REGEX.test("https://example.com/path##fragment")).toBe(false);
    });
  });

  describe("UUID_REGEX boundary conditions", () => {
    // Requirements 31.5, 31.6, 31.7

    it("[🎯] should match valid UUID v1", () => {
      // Boundary: valid UUIDs - v1
      expect(UUID_REGEX.test("6ba7b810-9dad-11d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("[🎯] should match valid UUID v2", () => {
      // Boundary: valid UUIDs - v2
      expect(UUID_REGEX.test("6ba7b811-9dad-21d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("[🎯] should match valid UUID v3", () => {
      // Boundary: valid UUIDs - v3
      expect(UUID_REGEX.test("6ba7b812-9dad-31d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("[🎯] should match valid UUID v4", () => {
      // Boundary: valid UUIDs - v4
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-446655440000")).toBe(true);
    });

    it("[🎯] should match valid UUID v5", () => {
      // Boundary: valid UUIDs - v5
      expect(UUID_REGEX.test("6ba7b814-9dad-51d1-80b4-00c04fd430c8")).toBe(true);
    });

    it("[🎯] should match uppercase UUIDs (case insensitive)", () => {
      // Edge case: case insensitive - uppercase
      expect(UUID_REGEX.test("550E8400-E29B-41D4-A716-446655440000")).toBe(true);
      expect(UUID_REGEX.test("AAAAAAAA-AAAA-1AAA-AAAA-AAAAAAAAAAAA")).toBe(true);
    });

    it("[🎯] should match mixed case UUIDs", () => {
      // Edge case: case insensitive - mixed case
      expect(UUID_REGEX.test("550e8400-E29B-41d4-A716-446655440000")).toBe(true);
      expect(UUID_REGEX.test("AaAaAaAa-BbBb-1CcC-9DdD-EeEeEeEeEeEe")).toBe(true);
    });

    it("[🎯] should not match UUIDs without dashes", () => {
      // Boundary: invalid UUIDs - no dashes
      expect(UUID_REGEX.test("550e8400e29b41d4a716446655440000")).toBe(false);
    });

    it("[🎯] should not match UUIDs with wrong dash positions", () => {
      // Boundary: invalid UUIDs - wrong dash positions
      expect(UUID_REGEX.test("550e840-0e29b-41d4-a716-446655440000")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29-b41d4-a716-446655440000")).toBe(false);
    });

    it("[🎯] should not match UUIDs with invalid version", () => {
      // Boundary: invalid UUIDs - invalid version (v6+)
      expect(UUID_REGEX.test("550e8400-e29b-61d4-a716-446655440000")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-71d4-a716-446655440000")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-01d4-a716-446655440000")).toBe(false);
    });

    it("[🎯] should not match UUIDs with invalid variant", () => {
      // Boundary: invalid UUIDs - invalid variant
      expect(UUID_REGEX.test("550e8400-e29b-41d4-c716-446655440000")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-0716-446655440000")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-7716-446655440000")).toBe(false);
    });

    it("[🎯] should not match UUIDs with invalid characters", () => {
      // Boundary: invalid UUIDs - invalid characters
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-44665544000g")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-44665544000z")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-44665544000!")).toBe(false);
    });

    it("[🎯] should not match UUIDs with wrong length", () => {
      // Boundary: invalid UUIDs - wrong length
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716")).toBe(false);
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-446655440000-extra")).toBe(
        false
      );
      expect(UUID_REGEX.test("550e8400-e29b-41d4-a716-4466554400000")).toBe(false);
    });

    it("[🎯] should not match empty string", () => {
      // Boundary: invalid UUIDs - empty
      expect(UUID_REGEX.test("")).toBe(false);
    });

    it("[🎯] should not match non-UUID strings", () => {
      // Boundary: invalid UUIDs - non-UUID
      expect(UUID_REGEX.test("not-a-uuid")).toBe(false);
      expect(UUID_REGEX.test("12345678-1234-1234-1234-123456789012")).toBe(false); // invalid variant
    });
  });
});


describe("[🎲] Property-Based Tests", () => {
  describe("EMAIL_REGEX", () => {
    // Generate valid email local parts (alphanumeric + allowed special chars)
    const validLocalPartArb = fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]*[a-zA-Z0-9]$/)
      .filter(s => s.length >= 2 && s.length <= 64 && !s.includes(".."));

    // Generate valid domain labels
    const validDomainLabelArb = fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/)
      .filter(s => s.length >= 2 && s.length <= 63);

    // Generate valid TLDs
    const validTldArb = fc.stringMatching(/^[a-zA-Z]{2,10}$/);

    itProp.prop([validLocalPartArb, validDomainLabelArb, validTldArb])(
      "[🎲] should match valid generated emails",
      (localPart, domain, tld) => {
        const email = `${localPart}@${domain}.${tld}`;
        expect(EMAIL_REGEX.test(email)).toBe(true);
      }
    );

    itProp.prop([fc.string().filter(s => !s.includes("@"))])(
      "[🎲] should not match strings without @ symbol",
      (s) => {
        expect(EMAIL_REGEX.test(s)).toBe(false);
      }
    );

    itProp.prop([fc.string()])(
      "[🎲] should not match strings with spaces",
      (s) => {
        if (s.includes(" ")) {
          expect(EMAIL_REGEX.test(s)).toBe(false);
        }
      }
    );
  });

  describe("URL_REGEX", () => {
    // Generate valid URL paths
    const validPathArb = fc.stringMatching(/^(\/[a-zA-Z0-9._-]+)*\/?$/)
      .filter(s => s.length <= 100);

    // Generate valid domain names
    const validDomainArb = fc.stringMatching(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]\.[a-zA-Z]{2,10}$/)
      .filter(s => s.length >= 5 && s.length <= 50);

    itProp.prop([fc.constantFrom("http", "https"), validDomainArb, validPathArb])(
      "[🎲] should match valid generated URLs",
      (scheme, domain, path) => {
        const url = `${scheme}://${domain}${path}`;
        expect(URL_REGEX.test(url)).toBe(true);
      }
    );

    itProp.prop([fc.constantFrom("ftp", "ws", "wss", "file", "mailto", "javascript", "data"), fc.string()])(
      "[🎲] should not match non-HTTP schemes",
      (scheme, rest) => {
        const url = `${scheme}://${rest}`;
        expect(URL_REGEX.test(url)).toBe(false);
      }
    );

    itProp.prop([fc.string().filter(s => !s.startsWith("http://") && !s.startsWith("https://"))])(
      "[🎲] should not match strings without http(s) scheme",
      (s) => {
        expect(URL_REGEX.test(s)).toBe(false);
      }
    );
  });

  describe("UUID_REGEX", () => {
    // Generate valid UUID hex segments
    const hex8Arb = fc.stringMatching(/^[0-9a-fA-F]{8}$/);
    const hex4Arb = fc.stringMatching(/^[0-9a-fA-F]{4}$/);
    const hex12Arb = fc.stringMatching(/^[0-9a-fA-F]{12}$/);
    const versionArb = fc.constantFrom("1", "2", "3", "4", "5");
    const variantArb = fc.constantFrom("8", "9", "a", "b", "A", "B");

    itProp.prop([hex8Arb, hex4Arb, versionArb, fc.stringMatching(/^[0-9a-fA-F]{3}$/), variantArb, fc.stringMatching(/^[0-9a-fA-F]{3}$/), hex12Arb])(
      "[🎲] should match valid generated UUIDs",
      (seg1, seg2, version, seg3, variant, seg4, seg5) => {
        const uuid = `${seg1}-${seg2}-${version}${seg3}-${variant}${seg4}-${seg5}`;
        expect(UUID_REGEX.test(uuid)).toBe(true);
      }
    );

    itProp.prop([fc.stringMatching(/^[0-9a-fA-F]{32}$/)])(
      "[🎲] should not match UUIDs without dashes",
      (hex32) => {
        expect(UUID_REGEX.test(hex32)).toBe(false);
      }
    );

    itProp.prop([fc.constantFrom("0", "6", "7", "8", "9")])(
      "[🎲] should not match UUIDs with invalid version",
      (invalidVersion) => {
        const uuid = `550e8400-e29b-${invalidVersion}1d4-a716-446655440000`;
        expect(UUID_REGEX.test(uuid)).toBe(false);
      }
    );

    itProp.prop([fc.constantFrom("0", "1", "2", "3", "4", "5", "6", "7", "c", "d", "e", "f")])(
      "[🎲] should not match UUIDs with invalid variant",
      (invalidVariant) => {
        const uuid = `550e8400-e29b-41d4-${invalidVariant}716-446655440000`;
        expect(UUID_REGEX.test(uuid)).toBe(false);
      }
    );
  });
});
