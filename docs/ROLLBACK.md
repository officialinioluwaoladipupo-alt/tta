# Rollback and recovery

## Vercel

Open the project Deployments page, select the last known-good deployment, and choose **Promote to Production**. Verify `/api/health`, login, a public page, and one dashboard read after promotion.

## Neon

For data recovery, create a snapshot branch or use Neon point-in-time restore. Restore into a separate branch first, verify the schema and data, then repoint the affected environment's `DATABASE_URL` only after approval. Never test recovery directly against the production branch.

## Secret rotation order

1. Revoke and replace the leaked credential at its provider.
2. Update the matching Vercel Production and Preview variable.
3. Redeploy and verify health, login, uploads, and media.

Rotate Auth0 client secret, `AUTH0_SECRET`, Cloudinary API secret, YouTube API key, Upstash credentials if enabled, and the Neon database password. For a database password leak, rotate the Neon role password first, update `DATABASE_URL`, and redeploy before revoking the old password.

## Contacts

Record the current technical owner and hosting/database provider contacts in the private incident runbook. Do not put personal phone numbers or credentials in this repository.
