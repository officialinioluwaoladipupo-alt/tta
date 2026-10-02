# The Thinking Architect (TTA) Website

Production Next.js website using Auth0 for authentication, Neon Postgres for application data, Cloudinary for media uploads, and YouTube for the media feed.

## Environment configuration

Copy `.env.example` to `.env.local` and fill in the values. Never commit `.env.local` or any other environment file.

- `NEXT_PUBLIC_SITE_URL`: public URL used for metadata, canonical links, sitemap, and robots.
- `APP_BASE_URL`: stable application URL used by Auth0 redirects.
- `AUTH0_DOMAIN`: Auth0 tenant domain.
- `AUTH0_CLIENT_ID`: Auth0 application client ID.
- `AUTH0_CLIENT_SECRET`: Auth0 application client secret.
- `AUTH0_SECRET`: secret used to encrypt Auth0 session cookies.
- `AUTH0_ADMIN_EMAILS`: comma-separated, case-insensitive email allowlist for dashboard access.
- `AUTH_ALLOW_EMAIL_FALLBACK`: set to exactly `true` only during the roles migration; defaults to disabled.
- `DATABASE_URL`: Neon Postgres connection string.
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name.
- `CLOUDINARY_API_KEY`: Cloudinary API key.
- `CLOUDINARY_API_SECRET`: Cloudinary API secret.
- `YOUTUBE_API_KEY`: YouTube Data API key for the media feed.

`AUTH0_CLIENT_ASSERTION_SIGNING_KEY` is only needed for private key JWT authentication and should normally remain unset.

## Auth0 production URLs

For `https://thethinkingarchitects.vercel.app`, register:

- Allowed Callback URL: `https://thethinkingarchitects.vercel.app/auth/callback`
- Allowed Logout URL: `https://thethinkingarchitects.vercel.app`
- Allowed Web Origin: `https://thethinkingarchitects.vercel.app`

Register the same three URL forms for the final custom domain once it is live.

## Database setup

Run `neon-schema.sql` against the intended Neon database before using the dashboard. The script is designed to be rerunnable and creates the required tables and indexes. The newsletter dedupe check is read-only and is available at `scripts/newsletter-dedupe-check.sql`.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Preview deployment checklist

- Confirm login and logout work.
- Submit a newsletter or community form.
- Create or edit one dashboard record with the intended role.
- Upload a valid image and confirm the public URL renders.
- Check `/api/health` returns `ok`.

## Tests and verification

```bash
npm run typecheck
npm run lint
npm run test -- --run
npm run build
```
