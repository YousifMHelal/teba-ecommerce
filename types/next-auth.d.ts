import { DefaultSession } from "next-auth"
import { AdapterUser as BaseAdapterUser } from "@auth/core/adapters"

declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"]
  }
  interface User {
    role: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}

// Augment the adapter user to include role
declare module "@auth/core/adapters" {
  interface AdapterUser {
    role: string
  }
}
