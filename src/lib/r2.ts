// R2 (Cloudflare object storage) utilities
// Handles image uploads and URL generation

import type { R2Bucket } from '@cloudflare/workers-types';

export interface UploadOptions {
  contentType?: string;
  metadata?: Record<string, string>;
  customMetadata?: Record<string, string>;
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Upload a file to R2
 */
export async function uploadToR2(
  r2: R2Bucket,
  key: string,
  body: ArrayBuffer | string,
  options?: UploadOptions,
): Promise<ImageUploadResult> {
  try {
    const result = await r2.put(key, body, {
      httpMetadata: {
        contentType: options?.contentType || 'application/octet-stream',
      },
      customMetadata: options?.customMetadata,
    });

    if (!result) {
      return {
        success: false,
        error: 'Failed to upload file to R2',
      };
    }

    const url = generateR2URL(key);

    return {
      success: true,
      url,
      key,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

/**
 * Delete a file from R2
 */
export async function deleteFromR2(r2: R2Bucket, key: string): Promise<boolean> {
  try {
    await r2.delete(key);
    return true;
  } catch (error) {
    console.error('Failed to delete from R2:', error);
    return false;
  }
}

/**
 * Get a file from R2
 */
export async function getFromR2(r2: R2Bucket, key: string) {
  try {
    const object = await r2.get(key);
    return object;
  } catch (error) {
    console.error('Failed to get file from R2:', error);
    return null;
  }
}

/**
 * Generate R2 URL (update with your actual R2 domain)
 * Format: https://{bucket-name}.{account-id}.r2.cloudflarestorage.com/{key}
 * OR use a custom domain if configured
 */
export function generateR2URL(key: string): string {
  // Option 1: Default R2 URL (update with your bucket name and account ID)
  // const bucketName = 'dj-zippy-media';
  // const accountId = 'YOUR_ACCOUNT_ID';
  // return `https://${bucketName}.${accountId}.r2.cloudflarestorage.com/${key}`;

  // Option 2: Custom domain (recommended for production)
  const customDomain = 'https://cdn.zippydj.com';
  return `${customDomain}/${key}`;
}

/**
 * Generate safe filename for uploads
 */
export function generateSafeFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  const ext = originalName.split('.').pop() || 'bin';
  return `${timestamp}-${random}.${ext}`;
}

/**
 * Upload image from file
 */
export async function uploadImage(
  r2: R2Bucket,
  file: File,
  folder: string = 'images',
): Promise<ImageUploadResult> {
  try {
    const buffer = await file.arrayBuffer();
    const safeFileName = generateSafeFileName(file.name);
    const key = `${folder}/${safeFileName}`;

    return uploadToR2(r2, key, buffer, {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        originalName: file.name,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Image upload failed',
    };
  }
}

/**
 * Upload image from URL
 */
export async function uploadImageFromURL(
  r2: R2Bucket,
  imageUrl: string,
  folder: string = 'images',
): Promise<ImageUploadResult> {
  try {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';

    // Extract filename from URL
    const urlParts = imageUrl.split('/');
    const originalName = urlParts[urlParts.length - 1] || 'image.jpg';

    const safeFileName = generateSafeFileName(originalName);
    const key = `${folder}/${safeFileName}`;

    return uploadToR2(r2, key, buffer, {
      contentType,
      customMetadata: {
        sourceUrl: imageUrl,
        uploadedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Image download/upload failed',
    };
  }
}
