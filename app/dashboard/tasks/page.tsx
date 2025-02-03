import * as React from 'react'

import { DataTable } from '@/components/task-list/data-table'
import { columns } from '@/components/task-list/columns'
import tasks from '@/components/task-list/tasks.json'

export default function TasksPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Tasks</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <DataTable data={tasks} columns={columns} />
    </div>
  )
}
