"use client";

import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

type AdminPinDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expectedPin: string;
  onSuccess: () => void;
};

export function AdminPinDialog({
  open,
  onOpenChange,
  expectedPin,
  onSuccess,
}: AdminPinDialogProps) {
  const PIN_LENGTH = 6;
  const [pinValue, setPinValue] = useState("");
  const [pinError, setPinError] = useState<string | null>(null);
  const normalizedExpectedPin = /^\d{6}$/.test(expectedPin)
    ? expectedPin
    : "123456";

  const resetState = () => {
    setPinValue("");
    setPinError(null);
  };

  const closeDialog = () => {
    resetState();
    onOpenChange(false);
  };

  const validatePin = (value: string) => {
    if (value !== normalizedExpectedPin) {
      setPinError("رمز PIN غير صحيح");
      setPinValue("");
      return;
    }

    resetState();
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          resetState();
        }
        onOpenChange(nextOpen);
      }}>
      <DialogContent
        className="overflow-hidden border-border/80 bg-background/95 p-0 shadow-2xl sm:max-w-lg"
        showCloseButton={false}>
        <div className="border-b border-border/60 bg-linear-to-l from-primary/10 via-primary/5 to-transparent px-6 py-5">
          <div className="mb-3 flex justify-end">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              حماية الأدمن
              <ShieldCheck className="size-3.5" />
            </span>
          </div>
          <div className="flex items-start justify-between gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-primary/20 bg-background/80 text-primary shadow-sm">
              <LockKeyhole className="size-5" />
            </div>
            <div className="text-right">
              <DialogTitle className="text-lg font-semibold tracking-tight">
                رمز الدخول للوحة التحكم
              </DialogTitle>
              <DialogDescription className="mt-1 text-sm leading-6">
              أدخل رمز PIN المكون من 6 أرقام للوصول إلى لوحة التحكم.
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-6 py-6">
          <InputOTP
            maxLength={PIN_LENGTH}
            pattern={REGEXP_ONLY_DIGITS}
            value={pinValue}
            onChange={(value) => {
              setPinValue(value);
              if (pinError) setPinError(null);

              if (value.length === PIN_LENGTH) {
                validatePin(value);
              }
            }}>
            <InputOTPGroup className="mx-auto gap-2" dir="ltr">
              {Array.from({ length: PIN_LENGTH }, (_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="size-12 rounded-2xl border border-border/70 bg-muted/20 text-base font-semibold shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition-all data-[active=true]:border-primary/60 data-[active=true]:bg-primary/10 data-[active=true]:ring-2 data-[active=true]:ring-primary/30"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {pinError ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-right text-xs font-medium text-destructive">
              {pinError}
            </div>
          ) : (
            <div className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
              <ShieldCheck className="size-3.5" />
              طبقة حماية إضافية لحساب الأدمن
            </div>
          )}
        </div>

        <DialogFooter
          className="grid grid-cols-2 gap-2 border-0 bg-muted/20 px-6 pb-6 pt-2"
          showCloseButton={false}>
          <Button type="button" variant="outline" size="lg" onClick={closeDialog}>
            إلغاء
          </Button>
          <Button
            type="button"
            size="lg"
            onClick={() => validatePin(pinValue)}
            disabled={pinValue.length !== PIN_LENGTH}>
            متابعة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
