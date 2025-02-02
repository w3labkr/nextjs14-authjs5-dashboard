import * as React from 'react'

export default function Workspace1Page() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Workspace1</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <div className="flex flex-1 flex-col gap-8">
        <div className="grid auto-rows-min gap-8 md:grid-cols-4">
          {Array.from({ length: 40 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-xl bg-muted/50" />
          ))}
        </div>
      </div>
    </div>
  )
}
