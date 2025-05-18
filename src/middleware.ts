import { NextRequest, NextResponse } from "next/server";
// import { allowedLinksAsStringArray } from "./allowed-links";
import { v4 as uuidv4 } from 'uuid';
// import { logMiddleware } from "./app/api/middlewares/winston-logger";
// import axios from "axios";
// import { generateLog } from "./lib/log-generator";
import { NextApiResponse } from "next";
import verifyToken from "./lib/verify-token";
import getInternalUrl from "./lib/get-internal-url";
import axios from "axios";


const sanitizeHeaders = (headers: Headers) => {
  const headersObj: Record<string, string> = {};
  headers.forEach((value, key) => {
    headersObj[key] = value;
  });
  ["authorization", "cookie", "cookies"].forEach((key) => {
    if (headersObj[key]) headersObj[key] = "REDACTED";
  });

  return headersObj;
};
export async function middleware(req: NextRequest, resApi: NextApiResponse) {
  const { cookies, nextUrl } = req;
  const { pathname } = req.nextUrl;
  const { internalHost, basePath } = getInternalUrl({ nextUrl: req.nextUrl })
  console.log("Global Middleware: middleware called - 001 ===> ", req.nextUrl.href, pathname)
  const correlationId = uuidv4();
  const sanitizedHeaders = sanitizeHeaders(req.headers);
  const currentUserId = cookies.get(`id`)?.value || "Unknown"
  const token = cookies.get(`access_token`);
  // const response = NextResponse.next();

  // Middleware for API validation
  if (pathname.startsWith("/api")) {
    console.log("Global Middleware: its a api call")
    const response = NextResponse.next()
    response.headers.set('correlation-id', correlationId)
    response.headers.set('host', req.headers.get("Host") || "")
    return response;
  }

  const publicPaths = ["/"];
  const isPublicPath = publicPaths.includes(pathname);

  if (isPublicPath) {
    if (token) {
      console.log("GM: yes i have token and am in public path")
      try {
        const userDetails = await verifyToken(token.value, nextUrl);
        if (userDetails) {

          const res = NextResponse.redirect(new URL(basePath + "/home", req.url));
        //   if (userDetails.tokenRefreshed) {
        //     res.cookies.set(`access_token`, userDetails.newAccessToken, { path: "/", httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
        //   }
          return res;
        }

        const logoutResponse = await logout(req, internalHost, basePath, false, true)
        return logoutResponse
      } catch (error: any) {
        console.log("Invalid user token found in cookies removing");
        const logoutResponse = await logout(req, internalHost, basePath, false, true)
        return logoutResponse
      }
    }
    const logoutResponse = NextResponse.next()
    return logoutResponse
  }

  if (token) {
    console.log("GM: we have token and i move to path ===> ", pathname);
    try {
      console.log("GM: verifying token");
      const userDetails = await verifyToken(token.value, nextUrl);
      // console.log("GM: userDeatils", userDetails);

      if (!userDetails) {
        const logoutResponse = await logout(req, internalHost, basePath, true, true)
        return logoutResponse
      }
      console.log("GM: Token is valid moves further", pathname)
        const res = NextResponse.next();
        // if (userDetails.tokenRefreshed) {
        //   res.cookies.set(`access_token`, userDetails.newAccessToken, { path: "/", httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
        //   res.cookies.set(`${PROD_ENV_NAME}pb_token_id`, userDetails.newTokenId, { path: "/", httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
        // }
        return res;
    } catch (error) {
      console.log("GM: Token is invalid & user tries invalid url ===XXXX", pathname)
      console.error("Token validation failed:", error);
      const logoutResponse = await logout(req, internalHost, basePath, true, true)
      return logoutResponse
    }
  } else {
    console.log(`No token provided for user ${currentUserId} attempting to access ${pathname}`);    
    const logoutResponse = NextResponse.redirect(new URL(basePath + "/", req.url))
    return logoutResponse
  }
}

const logout = async (req: NextRequest, internalHost: string, basePath: string, backToLogin: boolean = true, callLogout: boolean = true) => {
  console.log(`GM: Logout called ${internalHost}/api/auth/logout/`);

  try {
    callLogout && await axios.post(`${internalHost}/api/auth/logout/`, {})
  } catch (error: any) {
    console.log("GM: logout error", error.message);
  }
  const res = backToLogin ? NextResponse.redirect(new URL(basePath + "/", req.url)) : NextResponse.next()
    res.cookies.set(`access_token`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`id`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`name`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`email`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
  return res;
}

export const config = {
  matcher: [
    // '/securonix/:path*',
    // `/((?!api|_next/static|_next/image|favicon.ico).*)`,
    "/((?!api/logs|api/auth|_next/static|_next/image|favicon.ico).*)", "/"
    // '/securonix((?!_next|static|image|favicon.ico|robots.txt|sitemap.xml).*)'
  ],
};



