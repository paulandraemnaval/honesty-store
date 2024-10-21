import { NextResponse } from "next/server";
import { decrypt } from "@utils/session";
import { cookies } from "next/headers";
import { db } from "@utils/firebase";

const protectedRoutes = [];
const publicRoutes = [];

export default async function middleware(req) {
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  //decrypt session
  const encryptedSession = cookies().get("session")?.value;
  const sessionData = await decrypt(encryptedSession);

  let session = null;
  if (sessionData?.sessionId) {
    const sessionDoc = await db
      .collection("sessions")
      .doc(sessionData.sessionId)
      .get();
    session = sessionDoc.exists ? sessionDoc.data() : null;
  }

  const isSessionValid = session && new Date(session.expiresAt) > new Date();

  if (isProtectedRoute && (!isSessionValid || !session?.accountId)) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (
    isPublicRoute &&
    isSessionValid &&
    session?.accountId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
