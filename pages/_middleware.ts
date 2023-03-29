import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  if (
    !req.url.includes("/api") &&
    !req.url.includes("/guest") &&
    !req.url.includes("/reload")
  ) {
    const origin = req.nextUrl.origin;

    if (!req.url.includes("/login") && !req.cookies.reservationsite) {
      return NextResponse.redirect(`${origin}/login`);
    }

    if (req.url.includes("/login") && req.cookies.reservationsite) {
      return NextResponse.redirect(`${origin}`);
    }
  }
}
