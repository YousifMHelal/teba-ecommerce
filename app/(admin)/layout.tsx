import type { ReactNode } from "react"

import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { AdminTopbar } from "../../components/layout/AdminTopbar";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { AdminMobileHeader } from "@/components/admin/AdminMobileHeader";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <AdminSidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <AdminMobileHeader user={session.user} />
        <AdminTopbar user={session.user} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
