const configuredSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
const vercelProductionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();

function normalizeSiteUrl(value: string): string {
  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  return withProtocol.replace(/\/+$/, "");
}

export const SITE_URL = configuredSiteUrl
  ? normalizeSiteUrl(configuredSiteUrl)
  : vercelProductionUrl
    ? normalizeSiteUrl(vercelProductionUrl)
    : process.env.NODE_ENV !== "production"
      ? "http://localhost:3000"
      : "https://thethinkingarchitects.com.ng";
