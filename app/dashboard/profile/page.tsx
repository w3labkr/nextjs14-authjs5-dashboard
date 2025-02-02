import * as React from 'react'
import { ProfileForm } from '@/components/profile-form'

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Profile</h2>
        <p className="text-muted-foreground">This is how others will see you on the site.</p>
      </div>
      <ProfileForm />
    </div>
  )
}
