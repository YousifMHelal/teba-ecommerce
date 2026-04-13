import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button";
import { getOrderById } from "@/lib/actions/order.actions";
import { cn, formatPrice } from "@/lib/utils";
import { ORDER_STATUS, PAYMENT_METHOD_LABELS } from "@/lib/constants";

type PageProps = {
  searchParams: Promise<{ orderId?: string }>;
};

export const metadata = { title: "تم تأكيد طلبك" };

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { orderId } = await searchParams;
  const order = orderId ? await getOrderById(orderId) : null;

  return (
    <div className="container mx-auto px-4 py-16 max-w-xl text-center">
      {/* Success icon */}
      <div className="flex justify-center mb-6">
        <div className="h-20 w-20 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-2">تم تأكيد طلبك! 🎉</h1>
      <p className="text-muted-foreground mb-8">
        شكراً لك على طلبك. سنتواصل معك قريباً لتأكيد موعد التوصيل
      </p>

      {order && (
        <div className="rounded-xl border bg-background p-5 text-start space-y-3 mb-8">
          <h2 className="font-bold text-sm text-muted-foreground">
            تفاصيل الطلب
          </h2>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">رقم الطلب</p>
              <p className="font-mono font-medium text-xs">
                {order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">الحالة</p>
              <p className="font-medium">{ORDER_STATUS[order.status]}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">
                طريقة الدفع
              </p>
              <p className="font-medium">
                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs mb-0.5">الإجمالي</p>
              <p className="font-bold">{formatPrice(order.total)}</p>
            </div>
          </div>

          {/* Payment reference notice */}
          {order.paymentMethod !== "PAY_ON_DELIVERY" && (
            <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 mt-2">
              <p className="text-xs text-amber-800 dark:text-amber-200">
                سيتم مراجعة بيانات الدفع وتأكيد طلبك خلال 24 ساعة
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/account/orders"
          className={cn(buttonVariants(), "inline-flex")}>
          متابعة طلباتي
        </Link>
        <Link
          href="/shop"
          className={cn(buttonVariants({ variant: "outline" }), "inline-flex")}>
          مواصلة التسوق
        </Link>
      </div>
    </div>
  );
}
