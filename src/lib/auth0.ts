import { Auth0Client } from "@auth0/nextjs-auth0/server";

const rawDomain = process.env.AUTH0_DOMAIN?.trim();
const domain = rawDomain?.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const auth0 = new Auth0Client(domain ? { domain } : undefined);
