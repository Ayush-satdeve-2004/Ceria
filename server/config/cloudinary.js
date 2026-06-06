const cloudinary = require('cloudinary').v2;
const fs = require('fs');

const isConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  console.log('Cloudinary Media Upload configured successfully.');
} else {
  console.log('Cloudinary not configured. Falling back to secure local storage uploads.');
}

/**
 * Uploads a local file to Cloudinary (if configured) or returns null to trigger local relative URLs.
 * Automatically deletes the temporary local file if uploaded to Cloudinary.
 */
const uploadMedia = async (filePath, folder = 'ceria') => {
  if (!isConfigured) {
    return null; // Signals controller to keep local path
  }

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      resource_type: 'auto' // Autodetect image vs video
    });

    // Remove the file from local uploads after successful Cloudinary upload
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error('Cloudinary Upload Error:', error);
    // Keep local file as fallback in case Cloudinary upload fails
    return null;
  }
};

module.exports = {
  uploadMedia,
  isConfigured
};
