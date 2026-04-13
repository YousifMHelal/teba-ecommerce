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
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role === "ADMIN" ? "ADMIN" : "USER"
        token.name = user.name
        token.email = user.email
        token.picture = user.image
      }

      // Keep JWT in sync with `useSession().update(...)` from the client.
      if (trigger === "update" && session) {
        if (typeof session.name === "string") token.name = session.name
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        if (typeof token.id === "string") {
          session.user.id = token.id
        }
        if (token.role === "ADMIN" || token.role === "USER") {
          session.user.role = token.role
        }
        if (typeof token.name === "string") {
          session.user.name = token.name
        }
        if (typeof token.email === "string") {
          session.user.email = token.email
        }
        if (typeof token.picture === "string") {
          session.user.image = token.picture
        }
      }

      return session
    },
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
