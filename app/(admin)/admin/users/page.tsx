import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { getAllUsers } from "@/lib/actions/user.actions";

import DeleteUserButton from "./_components/DeleteUserButton";
import EditRoleButton from "./_components/EditRoleButton";
import UserSearchFilter from "./_components/UserSearchFilter";

export const metadata = { title: "المستخدمون" };

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; role?: string }>;
}) {
  const params = await searchParams;
  const search = params.search ?? "";
  const role = (params.role ?? "ALL") as "ALL" | "USER" | "ADMIN";

  const { users, total } = await getAllUsers(1, search, role);

  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl font-bold">المستخدمون</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">{total} مستخدم</p>
      </div>

      <UserSearchFilter />

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b bg-muted/50">
              <th className="px-4 py-3 text-start font-medium text-muted-foreground">
                المستخدم
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground sm:table-cell">
                الصلاحية
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground md:table-cell">
                الطلبات
              </th>
              <th className="hidden px-4 py-3 text-start font-medium text-muted-foreground lg:table-cell">
                تاريخ التسجيل
              </th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-muted/30">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name ?? ""}
                          fill
                          className="object-cover"
                          sizes="32px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-bold text-primary-foreground">
                          {user.name?.charAt(0) ?? "U"}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  <Badge
                    variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role === "ADMIN" ? "أدمن" : "عميل"}
                  </Badge>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {user._count.orders} طلب
                </td>
                <td className="hidden px-4 py-3 text-xs text-muted-foreground lg:table-cell">
                  {new Date(user.createdAt).toLocaleDateString("ar-EG", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    <EditRoleButton userId={user.id} currentRole={user.role} />
                    {user.role !== "ADMIN" ? (
                      <DeleteUserButton id={user.id} />
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
