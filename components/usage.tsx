'use client'

import * as React from 'react'

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export function Usage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Usage</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="mb-1 flex justify-between">
            <span>Bandwidth</span>
            <span>75% (750 GB / 1000 GB)</span>
          </div>
          <Progress value={75} className="w-full" />
        </div>
        <div>
          <div className="mb-1 flex justify-between">
            <span>Build Minutes</span>
            <span>50% (500 / 1000 minutes)</span>
          </div>
          <Progress value={50} className="w-full" />
        </div>
      </CardContent>
    </Card>
  )
}
