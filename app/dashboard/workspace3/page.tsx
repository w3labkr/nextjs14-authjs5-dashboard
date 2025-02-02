import * as React from 'react'

export default function Workspace3Page() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Workspace3</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <div className="mx-auto h-24 w-full rounded-xl bg-muted/50" />
        <div className="mx-auto h-[100vh] w-full rounded-xl bg-muted/50" />
      </div>
    </div>
  )
}
