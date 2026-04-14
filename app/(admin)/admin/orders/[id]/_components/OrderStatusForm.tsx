"use client"

import { useState } from "react"

import { useRouter } from "next/navigation"

import { updateOrderStatus, updatePaymentStatus } from "@/lib/actions/order.actions"
import { ORDER_STATUS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type Order = {
  id: string
  status: string
  paymentStatus: string
  paymentMethod: string
}

export function OrderStatusForm({ order }: { order: Order }) {
  const router = useRouter()
  const [orderStatus, setOrderStatus] = useState(order.status)
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus)
  const [isLoading, setIsLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    setSaved(false)

    try {
      await Promise.all([
        updateOrderStatus(order.id, orderStatus as any),
        updatePaymentStatus(order.id, paymentStatus as any),
      ])

      setSaved(true)
      router.refresh()
      window.setTimeout(() => setSaved(false), 3000)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="rounded-xl border bg-background p-5 shadow-sm space-y-4">
      <h2 className="text-sm font-bold">إدارة الطلب</h2>

      <div className="rounded-lg bg-muted p-3">
        <p className="mb-0.5 text-xs text-muted-foreground">طريقة الدفع</p>
        <p className="text-sm font-medium">
          {PAYMENT_METHOD_LABELS[order.paymentMethod as keyof typeof PAYMENT_METHOD_LABELS]}
        </p>
      </div>

      <div className="space-y-1.5">
        <Label>حالة الطلب</Label>
        <select
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={orderStatus}
          onChange={(event) => setOrderStatus(event.target.value)}
        >
          {Object.entries(ORDER_STATUS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label>حالة الدفع</Label>
        <select
          className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value)}
        >
          {Object.entries(PAYMENT_STATUS).map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <Button className="w-full" onClick={handleSave} disabled={isLoading}>
        {isLoading ? "جاري الحفظ..." : "حفظ التغييرات"}
      </Button>

      {saved ? <p className="text-center text-sm text-green-600">✓ تم حفظ التغييرات بنجاح</p> : null}
    </div>
  )
}
