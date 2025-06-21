// src/services/cloudinary.ts

// Cloudinary configuration from environment variables
export const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
export const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

// Validate that required environment variables are present
if (!CLOUD_NAME) {
  throw new Error(
    'Missing VITE_CLOUDINARY_CLOUD_NAME environment variable. ' +
    'Please add it to your .env file.'
  );
}

if (!UPLOAD_PRESET) {
  throw new Error(
    'Missing VITE_CLOUDINARY_UPLOAD_PRESET environment variable. ' +
    'Please add it to your .env file.'
  );
}

export const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`;
