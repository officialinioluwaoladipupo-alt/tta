# Environments

## Production

Vercel Production uses the main Neon branch through `DATABASE_URL`. Production secrets belong only in Vercel Production environment variables.

## Preview

Vercel Preview uses the staging Neon branch through its separate `DATABASE_URL`. Preview must never point at the production branch.

## Local

Local development uses a dedicated local or staging database URL in `.env.local`. Never copy production secrets into local files.

All schema changes run against staging first, are verified there, and only then are applied to production. No application request should perform a migration.
