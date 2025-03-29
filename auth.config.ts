import { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";

export const authConfig = {
    providers: [],
    callbacks: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
        async authorized({ request, auth } : any) {
            // check session cart cookie
            if (!request.cookies.get('sessionCartId')) {
                const sessionCartId = crypto.randomUUID();
                // clone header
                const newRequestHeader = new Headers(request.headers);
                // create new response and add new headers
                const response = NextResponse.next({
                    request: {
                        headers: newRequestHeader
                    }
                });
                response.cookies.set('sessionCartId', sessionCartId);
                return response;
            } else {
                return true;
            }
        }
    }
} satisfies NextAuthConfig;