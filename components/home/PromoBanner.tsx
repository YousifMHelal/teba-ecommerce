"use client"

import Link from "next/link"
import * as React from "react"

type TimeParts = {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const DAY_MS = 24 * 60 * 60 * 1000

function getOrCreateEndTime() {
  if (typeof window === "undefined") {
    return Date.now() + DAY_MS
  }

  const key = "teba_promo_end"
  const current = localStorage.getItem(key)
  const now = Date.now()

  if (current) {
    const value = Number(current)
    if (Number.isFinite(value) && value > now) {
      return value
    }
  }

  const next = now + DAY_MS
  localStorage.setItem(key, next.toString())
  return next
}

function toTimeParts(diff: number): TimeParts {
  const total = Math.max(0, Math.floor(diff / 1000))
  const days = Math.floor(total / 86400)
  const hours = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  return { days, hours, minutes, seconds }
}

export default function PromoBanner() {
  const [endTime, setEndTime] = React.useState<number>(() => Date.now() + DAY_MS)
  const [timeLeft, setTimeLeft] = React.useState<TimeParts>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  React.useEffect(() => {
    setEndTime(getOrCreateEndTime())
  }, [])

  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now()
      let target = endTime

      if (now >= target) {
        target = now + DAY_MS
        localStorage.setItem("teba_promo_end", target.toString())
        setEndTime(target)
      }

      setTimeLeft(toTimeParts(target - now))
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [endTime])

  const entries = [
    { label: "أيام", value: timeLeft.days },
    { label: "ساعات", value: timeLeft.hours },
    { label: "دقائق", value: timeLeft.minutes },
    { label: "ثوانٍ", value: timeLeft.seconds },
  ]

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center justify-between gap-6 rounded-2xl border border-[#00BFFF]/20 bg-linear-to-r from-[#0d1a2e] to-[#1a0d2e] p-8 md:flex-row">
        <div className="text-right">
          <span className="mb-3 inline-flex rounded-full border border-[#00BFFF]/30 bg-[#00BFFF]/10 px-3 py-1 text-xs text-[#00BFFF]">
            ⚡ عرض محدود
          </span>
          <h2 className="mb-2 text-2xl font-medium text-white">اطلب بالجملة ووفّر أكثر</h2>
          <p className="mb-6 text-sm text-white/70">
            خصم خاص على الطلبات فوق 50 جنيه - اتصل بنا لمعرفة أفضل سعر
          </p>
          <div className="flex flex-wrap justify-start gap-3">
            <Link
              href="/shop"
              className="rounded-lg bg-[#00BFFF] px-5 py-2.5 text-sm font-medium text-black">
              اطلب الآن
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-white/20 px-5 py-2.5 text-sm text-white">
              تواصل معنا
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {entries.map((entry) => (
            <div
              key={entry.label}
              className="min-w-15 rounded-xl bg-black/30 p-3 text-center">
              <p className="text-2xl font-medium text-[#00BFFF]">
                {entry.value.toString().padStart(2, "0")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{entry.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
