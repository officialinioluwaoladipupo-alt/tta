# Sentry setup

Sentry is disabled when the DSN variables are empty. Configure the project first in Sentry, then add these values to Vercel:

- `NEXT_PUBLIC_SENTRY_DSN`: client-side DSN.
- `SENTRY_DSN`: server and edge DSN for the same Sentry project.
- `SENTRY_ORG`: Sentry organization slug.
- `SENTRY_PROJECT`: Sentry project slug.
- `SENTRY_AUTH_TOKEN`: Sentry auth token with permission to create releases and upload source maps. Keep this server-side and out of preview environments unless source-map upload is needed there.

In Vercel, open the project Settings, then Environment Variables. Add the DSN values to Production and Preview as appropriate. Add org, project, and auth token for the deployment environments that should upload source maps. Redeploy after saving variables.

The Next.js instrumentation hook captures server component and route handler errors. Client SDK initialization captures browser errors. Event scrubbing removes request bodies, cookies, headers, query strings, URL parameters, and values under fields whose names include email, password, token, secret, authorization, or cookie.

To verify delivery, configure a temporary test error in a non-production preview, confirm it arrives in the Sentry project, then remove the test trigger. Do not add a permanent public error trigger.
