import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const token = req.cookies.get("token")?.value;
    const role = req.cookies.get("role")?.value;
    const pathname = req.nextUrl.pathname;

    if (!token) {
        return NextResponse.redirect(new URL("/Login", req.url));
    }

    if (pathname.startsWith("/Seller") && role !== "seller") {
        return NextResponse.redirect(new URL("/Unauthorized", req.url))
    }

    if (pathname.startsWith("/Buyer") && role !== "buyer") {
        return NextResponse.redirect(new URL("/Unauthorized", req.url))
    }


    if (pathname.startsWith("/Products/create") && role !== "seller") {
        return NextResponse.redirect(new URL("/Unauthorized", req.url));
    }


    if (pathname.startsWith("/Buyer/Orders") && role !== "buyer") {
        return NextResponse.redirect(new URL("/Unauthorized", req.url));
    }

    if (pathname.startsWith("/Seller/Orders") && role !== "seller") {
        return NextResponse.redirect(new URL("/Unauthorized", req.url));
    }

    return NextResponse.next();

}

export const config = {
    matcher: ["/Seller/:path*", "/Buyer/:path*", "/Products/create"]
}