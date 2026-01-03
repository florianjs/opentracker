import { requireAdminSession } from '../../utils/adminAuth';
import { setSetting, SETTINGS_KEYS } from '../../utils/settings';
import { randomBytes } from 'crypto';
import { writeFile, mkdir, unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

/**
 * POST /api/admin/logo
 * Upload a custom logo image (admin only)
 */
export default defineEventHandler(async (event) => {
  await requireAdminSession(event);

  const formData = await readMultipartFormData(event);
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      message: 'No file uploaded',
    });
  }

  const file = formData.find((f) => f.name === 'logo');
  if (!file || !file.data) {
    throw createError({
      statusCode: 400,
      message: 'No logo file found in upload',
    });
  }

  // Validate file type
  const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'];
  const mimeType = file.type || '';
  if (!allowedTypes.includes(mimeType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid file type. Allowed: PNG, JPEG, SVG, WebP',
    });
  }

  // Validate file size (max 2MB)
  const maxSize = 2 * 1024 * 1024;
  if (file.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      message: 'File too large. Maximum size: 2MB',
    });
  }

  // Get file extension
  const extMap: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
  };
  const ext = extMap[mimeType] || 'png';

  // Generate unique filename
  const filename = `logo-${randomBytes(8).toString('hex')}.${ext}`;
  
  // Ensure uploads directory exists
  const uploadsDir = join(process.cwd(), 'public', 'uploads');
  if (!existsSync(uploadsDir)) {
    await mkdir(uploadsDir, { recursive: true });
  }

  // Get current logo to delete old one
  const { getSiteLogoImage } = await import('../../utils/settings');
  const currentLogo = await getSiteLogoImage();
  
  // Save file
  const filePath = join(uploadsDir, filename);
  await writeFile(filePath, file.data);

  // File URL (relative to public folder)
  const fileUrl = `/uploads/${filename}`;

  // Save to settings
  await setSetting(SETTINGS_KEYS.SITE_LOGO_IMAGE, fileUrl);

  // Delete old logo if it exists and is in uploads folder
  if (currentLogo && currentLogo.startsWith('/uploads/')) {
    const oldPath = join(process.cwd(), 'public', currentLogo);
    try {
      if (existsSync(oldPath)) {
        await unlink(oldPath);
      }
    } catch {
      // Ignore deletion errors
    }
  }

  return {
    success: true,
    url: fileUrl,
  };
});
