"use client"

import { signOut, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isLoggedIn = status === "authenticated"
  const isAdmin = session?.user?.role === "ADMIN"

  const logout = async () => {
    await signOut({ redirect: false })
    router.push("/")
    router.refresh()
  }

  return {
    user: session?.user,
    isLoading,
    isLoggedIn,
    isAdmin,
    logout,
  }
}
