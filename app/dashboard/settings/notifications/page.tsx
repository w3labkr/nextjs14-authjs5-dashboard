import * as React from 'react'
import { NotificationsForm } from '@/components/notifications-form'

export default function NotificationsPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Notifications</h2>
        <p className="text-muted-foreground">Configure how you receive notifications.</p>
      </div>
      <NotificationsForm />
    </div>
  )
}
