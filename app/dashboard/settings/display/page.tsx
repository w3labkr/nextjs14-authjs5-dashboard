import * as React from 'react'
import { DisplayForm } from '@/components/display-form'

export default function DisplayPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Display</h2>
        <p className="text-muted-foreground">Turn items on or off to control what&apos;s displayed in the app.</p>
      </div>
      <DisplayForm />
    </div>
  )
}
