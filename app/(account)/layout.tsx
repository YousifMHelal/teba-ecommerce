import { redirect } from "next/navigation";

import AccountSidebar from "@/components/layout/AccountSidebar";
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <AccountSidebar user={session.user} />
        </aside>
        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
