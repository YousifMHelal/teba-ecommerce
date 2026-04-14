"use client"

import { useState } from "react"
import { updateUserRole } from "@/lib/actions/user.actions"
import { Button } from "@/components/ui/button"
import { ChevronDown, Loader2 } from "lucide-react"

interface EditRoleButtonProps {
  userId: string
  currentRole: "USER" | "ADMIN"
}

export default function EditRoleButton({ userId, currentRole }: EditRoleButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleRoleChange = async (newRole: "USER" | "ADMIN") => {
    if (newRole === currentRole) {
      setIsOpen(false)
      return
    }

    setIsLoading(true)
    try {
      const result = await updateUserRole(userId, newRole)
      if (!result.success) {
        console.error(result.error)
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        disabled={isLoading}
        className="gap-1">
        {isLoading ? (
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
        ) : (
          <ChevronDown className="h-3.5 w-3.5" />
        )}
        <span className="text-xs">
          {currentRole === "ADMIN" ? "أدمن" : "عميل"}
        </span>
      </Button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute top-full right-0 z-50 mt-1 rounded-lg border bg-background shadow-lg">
            <button
              onClick={() => handleRoleChange("ADMIN")}
              disabled={isLoading}
              className={`block w-full px-3 py-2 text-left text-sm ${
                currentRole === "ADMIN"
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:bg-muted"
              }`}>
              أدمن
            </button>
            <button
              onClick={() => handleRoleChange("USER")}
              disabled={isLoading}
              className={`block w-full px-3 py-2 text-left text-sm border-t ${
                currentRole === "USER"
                  ? "bg-primary/10 font-medium text-primary"
                  : "hover:bg-muted"
              }`}>
              عميل
            </button>
          </div>
        </>
      )}
    </div>
  )
}
