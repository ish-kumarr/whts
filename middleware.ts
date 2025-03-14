import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const auth = request.cookies.get("auth");
  const isAuthPage = request.nextUrl.pathname === "/";

  if (!auth?.value && !isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (auth?.value && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};