import * as React from 'react'

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-5">
        {Array.from({ length: 40 }).map((_, i) => (
          <div key={i} className="aspect-square rounded-xl bg-muted/50" />
        ))}
      </div>
    </div>
  )
}
