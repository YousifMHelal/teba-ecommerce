import { redirect } from "next/navigation";

import ProfileForm from "./_components/ProfileForm";
import PasswordForm from "./_components/PasswordForm";
import { auth } from "@/lib/auth";

export const metadata = { title: "الملف الشخصي" };

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-xl font-bold">الملف الشخصي</h1>
        <p className="text-muted-foreground text-sm mt-1">
          إدارة معلومات حسابك الشخصي
        </p>
      </div>

      <ProfileForm user={session.user} />
      <PasswordForm />
    </div>
  );
}
