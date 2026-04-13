import { getMyAddresses } from "@/lib/actions/user.actions";

import AddressesClient from "./_components/AddressesClient";

export const metadata = { title: "عناويني" };

export default async function AddressesPage() {
  const addresses = await getMyAddresses();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">عناويني</h1>
        <p className="text-muted-foreground text-sm mt-1">
          إدارة عناوين التوصيل المحفوظة
        </p>
      </div>
      <AddressesClient initialAddresses={addresses} />
    </div>
  );
}
