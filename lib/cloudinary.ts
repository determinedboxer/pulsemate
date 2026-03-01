// lib/cloudinary.ts

// Cloudinary configuration and utility functions
const CLOUD_NAME = 'ddnaxqmdw';

export interface CloudinaryImage {
  publicId: string;
  transformation?: string;
  format?: string;
}

// Generate Cloudinary URL
export function generateImageUrl(publicId: string, options: {
  width?: number;
  height?: number;
  crop?: string;
  quality?: string;
  blur?: number;
} = {}): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    blur
  } = options;

  let url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

  // Add transformations
  const transformations = [];
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (crop) transformations.push(`c_${crop}`);
  if (quality) transformations.push(`q_${quality}`);
  if (blur) transformations.push(`e_blur:${blur}`);

  if (transformations.length > 0) {
    url += `/${transformations.join(',')}`;
  }

  url += `/${publicId}`;

  return url;
}

// Generate blurred preview URL
export function getBlurredPreview(publicId: string): string {
  return generateImageUrl(publicId, {
    width: 400,
    height: 300,
    blur: 200,
    quality: 'auto:low'
  });
}

// Generate thumbnail URL
export function getThumbnailUrl(publicId: string): string {
  return generateImageUrl(publicId, {
    width: 100,
    height: 100,
    crop: 'thumb',
    quality: 'auto'
  });
}

// Example usage:
// const avatarUrl = generateImageUrl('mia/avatar', { width: 200, height: 200 });
// const blurredPhoto = getBlurredPreview('mia/private_photo_1');