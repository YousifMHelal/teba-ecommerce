"use client";

import { useState } from "react";
import { toast } from "sonner";

import {
  ADMIN_DASHBOARD_PIN_LENGTH,
  isValidAdminPin,
} from "@/lib/admin-pin";
import { updateAdminDashboardPin } from "@/lib/actions/admin-settings.actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AdminPinSettingsFormProps = {
};

export default function AdminPinSettingsForm() {
  const [currentPin, setCurrentPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const resetForm = () => {
    setCurrentPin("");
    setNewPin("");
    setConfirmPin("");
  };

  const handleSave = async () => {
    if (!isValidAdminPin(currentPin)) {
      toast.error(`رمز PIN الحالي يجب أن يكون ${ADMIN_DASHBOARD_PIN_LENGTH} أرقام`);
      return;
    }

    if (!isValidAdminPin(newPin)) {
      toast.error(`رمز PIN الجديد يجب أن يكون ${ADMIN_DASHBOARD_PIN_LENGTH} أرقام`);
      return;
    }

    if (newPin !== confirmPin) {
      toast.error("تأكيد رمز PIN غير متطابق");
      return;
    }

    if (newPin === currentPin) {
      toast.error("رمز PIN الجديد يجب أن يكون مختلفاً عن الحالي");
      return;
    }

    try {
      setIsSaving(true);
      const result = await updateAdminDashboardPin({ currentPin, newPin });
      setIsSaving(false);

      if (!result.success) {
        toast.error(result.error ?? "تعذر حفظ رمز PIN، حاول مرة أخرى");
        return;
      }

      toast.success("تم تحديث رمز PIN بنجاح");
      resetForm();
    } catch {
      setIsSaving(false);
      toast.error("حدث خطأ غير متوقع أثناء تحديث رمز PIN");
    }
  };

  return (
    <Card className="border bg-background shadow-sm">
      <CardHeader>
        <CardTitle>تغيير رمز PIN</CardTitle>
        <CardDescription>
          استخدم رمز PIN مكون من {ADMIN_DASHBOARD_PIN_LENGTH} أرقام للوصول إلى لوحة التحكم.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="current-pin">رمز PIN الحالي</Label>
          <Input
            id="current-pin"
            type="password"
            dir="ltr"
            inputMode="numeric"
            maxLength={ADMIN_DASHBOARD_PIN_LENGTH}
            autoComplete="off"
            value={currentPin}
            onChange={(event) =>
              setCurrentPin(event.target.value.replace(/\D/g, "").slice(0, ADMIN_DASHBOARD_PIN_LENGTH))
            }
            placeholder="••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-pin">رمز PIN الجديد</Label>
          <Input
            id="new-pin"
            type="password"
            dir="ltr"
            inputMode="numeric"
            maxLength={ADMIN_DASHBOARD_PIN_LENGTH}
            autoComplete="off"
            value={newPin}
            onChange={(event) =>
              setNewPin(event.target.value.replace(/\D/g, "").slice(0, ADMIN_DASHBOARD_PIN_LENGTH))
            }
            placeholder="••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-pin">تأكيد رمز PIN الجديد</Label>
          <Input
            id="confirm-pin"
            type="password"
            dir="ltr"
            inputMode="numeric"
            maxLength={ADMIN_DASHBOARD_PIN_LENGTH}
            autoComplete="off"
            value={confirmPin}
            onChange={(event) =>
              setConfirmPin(event.target.value.replace(/\D/g, "").slice(0, ADMIN_DASHBOARD_PIN_LENGTH))
            }
            placeholder="••••••"
          />
        </div>

        <div className="flex justify-end">
          <Button type="button" onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "جارٍ الحفظ..." : "حفظ التغييرات"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
