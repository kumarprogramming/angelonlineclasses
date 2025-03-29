import NextAuth from 'next-auth';
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/db/prisma';
import { compareSync } from 'bcrypt-ts-edge';
import { authConfig } from './auth.config';
import { cookies } from 'next/headers';
import Google from "next-auth/providers/google"
export const config = {
    pages: {
        signIn: '/sign-in',
        error: '/sign-in',
    },
    session: {
        strategy: "jwt" as const,
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours
    },
    adapter: PrismaAdapter(prisma),
    providers: [
        Google,
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { type: "email" },
                password: { type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                // find  user form database
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email as string
                    }
                })
                // check if user exist and password matches
                if (user && user.password) {
                    const isMatch = compareSync(credentials.password as string, user.password);
                    if (isMatch) {
                        return {
                            id: user.id,
                            name: user.name,
                            email: user.email,
                            role: user.role
                        }
                    }
                }
                // Return null if user does not exist or password does not match
                return null;
            }
        })
    ],
    callbacks: {
        ...authConfig.providers,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async session({ session, user, trigger, token }: any) {
            session.user.id = token.sub;
            session.user.role = token.role;
            session.user.name = token.name;
            if (trigger === 'update') {
                session.user.name = user.name;
            }
            return session;
        },

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async jwt({ session, user, trigger, token }: any) {
            if (user) {
                token.id = user.id;
                token.role = user.role;
                token.name = user.name !== 'NO_NAME' ? user.name : user.email.split('@')[0];
                // handle cart assignment on sign-in or sign-up
                if (trigger === 'signIn' || trigger === 'signUp') {
                    const cookieObject = await cookies();
                    const sessionCartId = cookieObject.get('sessionCartId')?.value;
                    if (sessionCartId) {
                        const sessionCart = await prisma.cart.findFirst({
                            where: { sessionCartId },
                            select: { id: true },
                        });
                        if (sessionCart) {
                            // assign new cart to the user
                            await prisma.cart.update({
                                where: { id: sessionCart.id },
                                data: { userId: user.id },
                            });
                        }
                    }
                }
            }
            if (session?.user?.name && trigger === 'update') {
                token.name = session.user.name;
            }
            // console.log(token);
            return token;
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        async signIn({ account, profile }: any) {
            console.log({
                "account": account,
                "profile": profile
            });
            let profileImage = undefined;
            if (account.provider === 'google') profileImage = profile.picture;
            if (account.provider === 'facebook') profileImage = profile.picture?.data.url;
            if (account.provider === "google" || account.provider === "facebook") {
                const user = await prisma.user.findUnique({
                    where: {email: profile.email},
                });
                if (user) {
                    await prisma.user.update({
                        where: { email: profile.email },
                        data: {image: profileImage}
                    });
                    await prisma.account.upsert({
                        where: {
                            provider_providerAccountId: {
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                            }
                        },
                        update: {
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                        },
                        create: {
                            userId: user.id,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            type: account.type,
                            access_token: account.access_token,
                            expires_at: account.expires_at,
                            token_type: account.token_type,
                        }
                    });
                }
                if (account.provider === "google") {
                    return profile.email_verified ?? false;
                }
                if (account.provider === "facebook") {
                    return profile.email ? true : false;
                }
            }
            return true;
        },
    }
}
export const { handlers, auth, signIn, signOut } = NextAuth(config);