import * as React from 'react'

export default function Workspace2Page() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Workspace2</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        {Array.from({ length: 24 }).map((_, index) => (
          <div key={index} className="aspect-video h-32 w-full rounded-lg bg-muted/50" />
        ))}
      </div>
    </div>
  )
}
