import * as React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
  description: "",
}

export default function SignInLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
  return <>{children}</>
}
