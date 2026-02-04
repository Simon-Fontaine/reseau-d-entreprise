export { auth as proxy } from "@/auth";

export const config = {
  /*
   * Match all request paths except for:
   * - api (API routes)
   * - _next/static (static files)
   * - _next/image (image optimization files)
   * - favicon.ico, sitemap.xml, robots.txt (metadata files)
   * - image/ (public folder assets)
   */
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|image/).*)",
  ],
};
