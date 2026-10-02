import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site-url'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/events`, lastModified: new Date() },
    { url: `${SITE_URL}/media`, lastModified: new Date() },
    { url: `${SITE_URL}/community`, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
  ]
}
