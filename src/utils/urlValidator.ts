/**
 * Safe external URL validation and sanitization utilities.
 * Enforces secure protocols (https: and http:) and prevents XSS/malformed URLs.
 */

const ALLOWED_PROTOCOLS = new Set(['https:', 'http:']);

/**
 * Validates if a string is a safe, valid external web URL.
 * Rejects javascript:, data:, vbscript:, malformed, or empty URLs.
 */
export function isValidExternalUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return false;
  const trimmed = url.trim();
  if (!trimmed) return false;

  // Basic check for dangerous pseudo-protocols before parsing
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith('javascript:') ||
    lower.startsWith('data:') ||
    lower.startsWith('vbscript:') ||
    lower.startsWith('file:')
  ) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    if (!ALLOWED_PROTOCOLS.has(parsed.protocol)) {
      return false;
    }
    // Hostname must be valid
    if (!parsed.hostname || parsed.hostname.length < 3) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Returns a sanitized URL if valid, or a fallback URL if provided and valid.
 * Returns null if both are invalid.
 */
export function sanitizeExternalUrl(
  url?: string | null,
  fallbackUrl?: string | null
): string | null {
  if (isValidExternalUrl(url)) {
    return url!.trim();
  }
  if (isValidExternalUrl(fallbackUrl)) {
    return fallbackUrl!.trim();
  }
  return null;
}

/**
 * Checks whether a URL is a placeholder or template string
 * (e.g., contains example.com, #, or placeholder markers).
 */
export function isPlaceholderUrl(url?: string | null): boolean {
  if (!url || typeof url !== 'string') return true;
  const trimmed = url.trim().toLowerCase();
  if (
    trimmed === '' ||
    trimmed === '#' ||
    trimmed.includes('example.com') ||
    trimmed.includes('example.org') ||
    trimmed.includes('example.net') ||
    trimmed.includes('placeholder')
  ) {
    return true;
  }
  return false;
}

/**
 * Validates that an internship application URL is syntactically valid,
 * uses safe external protocols (https: or http:), and is not a placeholder/demo link.
 */
export function isUsableApplicationUrl(url?: string | null): boolean {
  if (!isValidExternalUrl(url)) return false;
  if (isPlaceholderUrl(url)) return false;
  return true;
}
