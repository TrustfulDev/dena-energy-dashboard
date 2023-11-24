import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/sign-in","/sign-up"],
  afterAuth(auth, req, evt) {
    if (!auth.userId && !auth.isPublicRoute) {
      const signin = new URL('/sign-in', req.url);
      return NextResponse.redirect(signin);
    }

    if (auth.userId && !auth.orgId && req.nextUrl.pathname !== "/") {
      const home = new URL('/', req.url);
      return NextResponse.redirect(home);
    }
  },
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
 