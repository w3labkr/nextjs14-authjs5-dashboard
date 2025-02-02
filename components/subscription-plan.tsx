'use client'

import * as React from 'react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function SubscriptionPlan() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Plan</CardTitle>
        <CardDescription>You are currently on the Pro plan</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">$20/month</span>
          <Button variant="outline">Change Plan</Button>
        </div>
      </CardContent>
    </Card>
  )
}
