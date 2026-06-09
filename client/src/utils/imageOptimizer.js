/**
 * Cloudinary dynamic image optimization helper.
 * Automatically injects f_auto,q_auto, and scaling width parameter
 * to drastically reduce download size and preserve visual quality.
 */
export const optimizeImageUrl = (url, width) => {
  if (!url) return '';
  
  // Only transform Cloudinary uploads
  if (url.includes('res.cloudinary.com') && url.includes('/image/upload/')) {
    let transformation = 'f_auto,q_auto';
    if (width) {
      transformation += `,w_${width},c_limit`;
    }
    return url.replace('/image/upload/', `/image/upload/${transformation}/`);
  }
  
  return url;
};
