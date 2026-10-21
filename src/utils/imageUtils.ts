// Utility to get product image URL - handles database image paths
export const getProductImageUrl = (imageUrl?: string): string => {
  if (!imageUrl) {
    return '/placeholder.svg';
  }

  // If it's a base64 encoded image, return it directly
  if (imageUrl.startsWith('data:image')) {
    return imageUrl;
  }

  // If it's an external web URL, return it directly
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // Handle Windows-style paths from database (e.g., 'src\image\filename.jpg')
  // Convert backslashes to forward slashes first
  const normalizedPath = imageUrl.replace(/\\/g, '/');

  // If it starts with /image/ already, return as is
  if (normalizedPath.startsWith('/image/')) {
    return normalizedPath;
  }

  // If it starts with image/, prepend /
  if (normalizedPath.startsWith('image/')) {
    return `/${normalizedPath}`;
  }

  // Extract filename from path like 'src/image/filename.jpg', 'src/assets/filename.jpg', etc.
  if (
    normalizedPath.includes('src/image/') ||
    normalizedPath.includes('src/img/') ||
    normalizedPath.includes('src/assets/') ||
    normalizedPath.includes('/image/')
  ) {
    const filename = normalizedPath.split('/').pop();
    if (filename) {
      return `/image/${filename}`;
    }
  }

  // If it's just a filename (e.g. 'chemis.jfif' or 'sport.jfif'), resolve to /image/
  if (!normalizedPath.includes('/')) {
    return `/image/${normalizedPath}`;
  }

  // If it's any other absolute path starting with /, return it
  if (normalizedPath.startsWith('/')) {
    return normalizedPath;
  }

  // Fallback to filename in /image/
  const filename = normalizedPath.split('/').pop();
  return filename ? `/image/${filename}` : '/placeholder.svg';
};
