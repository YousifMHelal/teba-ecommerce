"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cancelAndDeleteMyOrder } from "@/lib/actions/order.actions";

type CancelDeleteOrderButtonProps = {
  orderId: string;
};

export default function CancelDeleteOrderButton({ orderId }: CancelDeleteOrderButtonProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resetState = () => {
    setError(null);
  };

  const closeDialog = () => {
    resetState();
    setIsDialogOpen(false);
  };

  const handleCancelDelete = async () => {
    setIsPending(true);
    setError(null);

    const toastId = toast.loading("جارٍ حذف الطلب...");

    const result = await cancelAndDeleteMyOrder(orderId);
    setIsPending(false);

    if (!result.success) {
      setError(result.error ?? "حدث خطأ أثناء حذف الطلب");
      toast.error(result.error ?? "حدث خطأ أثناء حذف الطلب", {
        id: toastId,
      });
      return;
    }

    toast.success("تم حذف الطلب بنجاح", { id: toastId });
    setIsDialogOpen(false);
    resetState();
    router.push("/orders");
    router.refresh();
  };

  return (
    <>
      <Button
        type="button"
        variant="destructive"
        className="gap-2"
        onClick={() => setIsDialogOpen(true)}
      >
        <Trash2 className="h-4 w-4" />
        إلغاء وحذف الطلب
      </Button>

      <Dialog
        open={isDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDialog();
            return;
          }

          setIsDialogOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-md" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-right">تأكيد حذف الطلب</DialogTitle>
            <DialogDescription className="text-right">
              هذه العملية ستلغي الطلب ثم تحذفه نهائياً. هل تريد المتابعة؟
            </DialogDescription>
          </DialogHeader>

          {error && (
            <p className="text-right text-xs font-medium text-destructive">
              {error}
            </p>
          )}

          <DialogFooter className="p-2 pt-2" showCloseButton={false}>
            <Button type="button" variant="outline" onClick={closeDialog} disabled={isPending}>
              لا
            </Button>
            <Button type="button" variant="destructive" onClick={handleCancelDelete} disabled={isPending}>
              {isPending ? "جارٍ الحذف..." : "نعم"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
