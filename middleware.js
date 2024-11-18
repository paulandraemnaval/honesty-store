import { NextResponse } from "next/server";
import { decrypt } from "@utils/session";
import { cookies } from "next/headers";

const protectedRoutes = ["/admin/user"];
const publicRoutes = ["/admin"];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  console.log("Middleware executed for path:", path);

  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  const encryptedSession = cookies().get("session")?.value;
  const sessionData = await decrypt(encryptedSession);
  console.log(sessionData);

  if (!sessionData) {
    console.warn("No session data found.");
  }
  const isSessionValid =
    sessionData && new Date(sessionData.expiresAt) > new Date();

  if (isProtectedRoute && !isSessionValid) {
    return NextResponse.redirect(new URL("/admin", req.nextUrl));
  }

  if (
    isPublicRoute &&
    isSessionValid &&
    !req.nextUrl.pathname.startsWith("/admin/user")
  ) {
    return NextResponse.redirect(new URL("/admin/user", req.nextUrl));
  }

  return NextResponse.next();
}

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|..png$).)"],
// };
