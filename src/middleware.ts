import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";


// export function middleware(request:NextRequest){
//     const path=request.nextUrl.pathname
//     // const token=await getToken({req:request});

//     const isPublicPath=path==='/login' || path==='/signup' || path==='/verifyemail'
//     const token =request.cookies.get('token')?.value || ''
//     if(isPublicPath&& token){
//         return NextResponse.redirect(new URL('/',request.nextUrl))
//     }
//     if(!isPublicPath && !token){
//         return NextResponse.redirect(new URL('/login',request.nextUrl))
//     }

// }

export async function middleware(request:NextRequest){
    const token=await getToken({req:request})
    const url=request.nextUrl
    if(token && 
        (
        url.pathname.startsWith('/sign-up') ||
        url.pathname.startsWith('/sign-in') ||
        url.pathname.startsWith('/verify') ||
        url.pathname.startsWith('/')
        )
    ){
    return NextResponse.redirect(new URL('/dashboard',request.url))
    }
    if(!token && url.pathname.startsWith('/dashboard')){
        return NextResponse.redirect(new URL ('/sign-in',request.url));
    }
    return NextResponse.next()
}


// See "Matching paths" below to learn more
export const config={
    matcher:[
        '/',
        // '/profile',
        '/sign-in',
        '/sign-up',
        // '/login',
        '/verifyemail',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}