import * as React from 'react'
import { AppearanceForm } from '@/components/appearance-form'

export default function AppearancePage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Appearance</h2>
        <p className="text-muted-foreground">
          Customize the appearance of the app. Automatically switch between day and night themes.
        </p>
      </div>
      <AppearanceForm />
    </div>
  )
}
