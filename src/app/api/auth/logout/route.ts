import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const PROD_ENV_NAME = process.env.NEXT_PUBLIC_PROD_ENV ?? "";
const COOKIE_EXP_TIME = parseInt(process.env.NEXT_PUBLIC_COOKIE_EXP || "86400")
const JWT_EXP_TIME: any = process.env.NEXT_PUBLIC_JWT_EXP || "300s"
export async function POST(req: NextRequest) {
    console.log("user logging out...");
    
    const token = req.cookies.get(`access_token`)?.value;
    let tokenId: string = "";
    const { method, url, nextUrl } = req;

    const res =  NextResponse.json({status : "success", message : "Logged out successfully"}, {status : 200});
    res.cookies.set(`access_token`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`id`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`name`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    res.cookies.set(`email`, "", { path: "/", maxAge: 0, httpOnly: true, secure: process.env.NEXT_PUBLIC_SECURE_ATTR === 'secure' ? true : false, sameSite: "lax" });
    return res;
}