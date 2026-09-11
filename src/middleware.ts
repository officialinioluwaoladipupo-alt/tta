import { NextResponse, type NextRequest } from "next/server";
import { auth0 } from "@/lib/auth0";

export async function middleware(request: NextRequest) {
    const isDashboard = request.nextUrl.pathname.startsWith("/dashboard");
    const hasAuthConfig = Boolean(
        process.env.AUTH0_DOMAIN &&
        process.env.AUTH0_CLIENT_ID &&
        process.env.AUTH0_SECRET &&
        (process.env.AUTH0_CLIENT_SECRET || process.env.AUTH0_CLIENT_ASSERTION_SIGNING_KEY)
    );

    if (!hasAuthConfig) {
        if (isDashboard) {
            return NextResponse.json({ error: "Auth0 is not configured" }, { status: 503 });
        }
        return NextResponse.next();
    }

    try {
        const response = await auth0.middleware(request);
        if (isDashboard) {
            const session = await auth0.getSession(request);
            if (!session) return NextResponse.redirect(new URL("/auth/login", request.url));
        }
        return response;
    } catch (error) {
        console.error("Auth0 middleware configuration error", error);
        return isDashboard
            ? NextResponse.json({ error: "Authentication service unavailable" }, { status: 503 })
            : NextResponse.next();
    }
}

export const config = { matcher: ["/auth/:path*", "/dashboard/:path*"] };
