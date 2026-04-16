import type { NextAuthConfig } from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import Credentials from "next-auth/providers/credentials"
import Facebook from "next-auth/providers/facebook"
import Google from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import NextAuth from "next-auth"

import { prisma } from "@/lib/prisma"
import { loginSchema } from "@/lib/validations"

export const authConfig: NextAuthConfig = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    ...(process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
      ? [
        Google({
          clientId: process.env.AUTH_GOOGLE_ID,
          clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
      ]
      : []),
    ...(process.env.AUTH_FACEBOOK_ID && process.env.AUTH_FACEBOOK_SECRET
      ? [
        Facebook({
          clientId: process.env.AUTH_FACEBOOK_ID,
          clientSecret: process.env.AUTH_FACEBOOK_SECRET,
        }),
      ]
      : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "البريد الإلكتروني", type: "email" },
        password: { label: "كلمة المرور", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials)

        if (!parsed.success) return null

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
        })

        if (!user?.password) {
          return null
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.password)

        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          role: user.role === "ADMIN" ? "ADMIN" : "USER",
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
    // On sign-in, user object is available — persist role and id into token
      if (user) {
        token.role = user.role;
        token.id = user.id ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      // Forward token fields into the session object
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
      }
      return session;
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
