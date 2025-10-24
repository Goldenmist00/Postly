/**
 * Validates if a string is a valid URL for images
 */
export function isValidImageUrl(url: string | null | undefined): url is string {
  if (!url || typeof url !== 'string' || !url.trim()) {
    return false;
  }

  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
}

/**
 * Safely gets an image URL, returning null if invalid
 */
export function getSafeImageUrl(url: string | null | undefined): string | null {
  return isValidImageUrl(url) ? url : null;
}

/**
 * Gets a fallback image URL if the provided URL is invalid
 */
export function getImageUrlWithFallback(
  url: string | null | undefined, 
  fallback: string = "/placeholder.svg"
): string {
  return isValidImageUrl(url) ? url : fallback;
}