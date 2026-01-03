import { getSiteName, getSiteLogo, getSiteLogoImage, getSiteSubtitle } from '../utils/settings';

/**
 * GET /api/branding
 * Public endpoint for site branding (no auth required)
 */
export default defineEventHandler(async () => {
  const siteName = await getSiteName();
  const siteLogo = await getSiteLogo();
  const siteLogoImage = await getSiteLogoImage();
  const siteSubtitle = await getSiteSubtitle();

  return {
    siteName,
    siteLogo,
    siteLogoImage,
    siteSubtitle,
  };
});
