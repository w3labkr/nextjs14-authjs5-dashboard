import * as React from 'react'
import { AccountForm } from '@/components/account-form'

export default function AccountPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Account</h2>
        <p className="text-muted-foreground">Update your account settings. Set your preferred language and timezone.</p>
      </div>
      <AccountForm />
    </div>
  )
}
