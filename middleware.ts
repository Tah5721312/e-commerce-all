// middleware.ts

import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN";
    const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

    // إذا كان يحاول الوصول للـ Dashboard وليس أدمن
    if (isDashboard && !isAdmin) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
    // أضف هنا أي صفحات تريد حمايتها
  ],
};