import { authMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
 
// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  afterAuth(auth, req, evt) {
    const path = new URL(req.url).pathname;
    const isApiRoute = path.startsWith('/api/');
    const isPublicRoute = ["/sign-in", "/sign-up"].includes(path) || isApiRoute;

    if (!auth.userId && !isPublicRoute) {
      const signin = new URL('/sign-in', req.url);
      return NextResponse.redirect(signin);
    }

    return NextResponse.next();
  },
});



export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};