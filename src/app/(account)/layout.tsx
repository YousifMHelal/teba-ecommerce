import type { ReactNode } from "react"

import { AccountSidebar } from "@/components/layout/AccountSidebar"

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
      <AccountSidebar />
      <div>{children}</div>
    </div>
  )
}
