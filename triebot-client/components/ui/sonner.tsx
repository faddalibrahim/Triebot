"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4 text-neo-green" />
        ),
        info: (
          <InfoIcon className="size-4 text-neo-cyan" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4 text-neo-pink" />
        ),
        error: (
          <OctagonXIcon className="size-4 text-neo-red" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin text-neo-purple" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--color-neo-surface)",
          "--normal-text": "#ffffff",
          "--normal-border": "rgba(255, 255, 255, 0.1)",
          "--success-bg": "var(--color-neo-surface)",
          "--success-text": "#ffffff",
          "--success-border": "var(--color-neo-green)",
          "--error-bg": "var(--color-neo-surface)",
          "--error-text": "#ffffff",
          "--error-border": "var(--color-neo-red)",
          "--info-bg": "var(--color-neo-surface)",
          "--info-text": "#ffffff",
          "--info-border": "var(--color-neo-cyan)",
          "--warning-bg": "var(--color-neo-surface)",
          "--warning-text": "#ffffff",
          "--warning-border": "var(--color-neo-pink)",
          "--border-radius": "12px",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-neo-surface group-[.toaster]:text-white group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl font-sans",
          description: "group-[.toast]:text-zinc-400 font-medium",
          actionButton: "group-[.toast]:bg-neo-purple group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-white/5 group-[.toast]:text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
