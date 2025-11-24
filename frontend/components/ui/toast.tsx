import * as React from "react"

export interface ToastProps {
  message: string
  type?: "success" | "error" | "info"
  onClose?: () => void
}

export function Toast({ message, type = "info", onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  }[type]

  return (
    <div
      className={`fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-4`}
    >
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="text-white hover:text-gray-200"
        >
          ×
        </button>
      )}
    </div>
  )
}

