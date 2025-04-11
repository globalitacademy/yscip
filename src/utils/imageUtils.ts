/**
 * Gets a properly formatted image URL for a project
 * @param imagePath The image path which could be relative or absolute
 * @param fallbackCategory Optional category to use for fallback image
 * @returns A properly formatted image URL
 */
export const getFormattedImageUrl = (imagePath?: string, fallbackCategory?: string): string => {
  if (!imagePath) {
    return `https://source.unsplash.com/random/800x600/?${encodeURIComponent(fallbackCategory || 'technology')}`;
  }
  
  // Check if this is already a full URL (starts with http:// or https://)
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  // If it's a relative path starting with /, make it absolute
  if (imagePath.startsWith('/')) {
    // Get base URL (without trailing slash)
    const baseUrl = window.location.origin;
    return `${baseUrl}${imagePath}`;
  }
  
  // Otherwise just return the path as is
  return imagePath;
};

/**
 * Handles image loading errors by replacing with a fallback
 * @param event The error event
 * @param category Optional category to use for the fallback image
 */
export const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>, category?: string): void => {
  const element = event.currentTarget;
  element.onerror = null; // Prevent infinite loop
  element.src = `https://source.unsplash.com/random/800x600/?${encodeURIComponent(category || 'technology')}`;
};
