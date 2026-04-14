import { redirect } from "next/navigation";

import AccountSidebar from "@/components/layout/AccountSidebar";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import { auth } from "@/lib/auth";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8 flex-1">
      <div className="flex flex-col gap-8 md:flex-row md:items-start">
        <aside className="md:sticky md:top-24 md:h-[calc(100vh-6rem)] md:w-80 md:shrink-0">
          <AccountSidebar user={session.user} />
        </aside>

        <div className="flex-1 min-w-0 space-y-8">
          <AppBreadcrumb />
          <main>{children}</main>
        </div>
      </div>
    </div>
  );
}
