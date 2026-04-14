"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { ORDER_STATUS, PAYMENT_METHOD_LABELS, PAYMENT_STATUS } from "@/lib/constants"

type OrderFiltersProps = {
  initialSearch: string
  initialStatus: string
  initialPaymentStatus: string
  initialPaymentMethod: string
}

export default function OrderFilters({
  initialSearch,
  initialStatus,
  initialPaymentStatus,
  initialPaymentMethod,
}: OrderFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [search, setSearch] = useState(initialSearch)
  const [status, setStatus] = useState(initialStatus)
  const [paymentStatus, setPaymentStatus] = useState(initialPaymentStatus)
  const [paymentMethod, setPaymentMethod] = useState(initialPaymentMethod)

  useEffect(() => {
    setSearch(initialSearch)
  }, [initialSearch])

  useEffect(() => {
    setStatus(initialStatus)
  }, [initialStatus])

  useEffect(() => {
    setPaymentStatus(initialPaymentStatus)
  }, [initialPaymentStatus])

  useEffect(() => {
    setPaymentMethod(initialPaymentMethod)
  }, [initialPaymentMethod])

  const updateQuery = (
    nextSearch: string,
    nextStatus: string,
    nextPaymentStatus: string,
    nextPaymentMethod: string
  ) => {
    const params = new URLSearchParams()

    if (nextSearch.trim()) params.set("search", nextSearch.trim())
    if (nextStatus) params.set("status", nextStatus)
    if (nextPaymentStatus) params.set("paymentStatus", nextPaymentStatus)
    if (nextPaymentMethod) params.set("paymentMethod", nextPaymentMethod)

    const query = params.toString()
    router.replace(query ? `${pathname}?${query}` : pathname)
  }

  return (
    <div className="grid w-full gap-3 md:w-auto md:grid-cols-2 xl:grid-cols-4">
      <Input
        value={search}
        onChange={(event) => {
          const value = event.target.value
          setSearch(value)
          updateQuery(value, status, paymentStatus, paymentMethod)
        }}
        placeholder="ابحث برقم الطلب أو العميل..."
        className="h-10"
      />

      <select
        value={status}
        onChange={(event) => {
          const value = event.target.value
          setStatus(value)
          updateQuery(search, value, paymentStatus, paymentMethod)
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option value="">كل الحالات</option>
        {Object.entries(ORDER_STATUS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={paymentStatus}
        onChange={(event) => {
          const value = event.target.value
          setPaymentStatus(value)
          updateQuery(search, status, value, paymentMethod)
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option value="">كل حالات الدفع</option>
        {Object.entries(PAYMENT_STATUS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      <select
        value={paymentMethod}
        onChange={(event) => {
          const value = event.target.value
          setPaymentMethod(value)
          updateQuery(search, status, paymentStatus, value)
        }}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <option value="">كل طرق الدفع</option>
        {Object.entries(PAYMENT_METHOD_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
