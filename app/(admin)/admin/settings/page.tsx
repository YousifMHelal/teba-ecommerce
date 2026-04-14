import AdminPinSettingsForm from "./_components/AdminPinSettingsForm";

export const metadata = { title: "الإعدادات" };

export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <div>
        <h1 className="text-xl font-bold">الإعدادات</h1>
        <p className="mt-0.5 text-sm text-muted-foreground">
          إدارة إعدادات لوحة التحكم
        </p>
      </div>

      <AdminPinSettingsForm />
    </div>
  );
}
