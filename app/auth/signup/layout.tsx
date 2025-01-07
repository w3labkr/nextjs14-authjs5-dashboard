import * as React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up",
  description: "",
}

export default function SignUpLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return <>{children}</>
}
