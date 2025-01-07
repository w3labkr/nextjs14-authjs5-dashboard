import * as React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "New Password",
  description: "",
}

export default function NewPasswordLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return <>{children}</>
}
