'use client'

import * as React from 'react'
import { Bell, BellRing, Check } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'

const notifications = [
  {
    title: 'Your call has been confirmed.',
    description: '1 hour ago',
  },
  {
    title: 'You have a new message!',
    description: '1 hour ago',
  },
  {
    title: 'Your subscription is expiring soon!',
    description: '2 hours ago',
  },
]

export function NavNotify() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button type="button" className="relative p-2">
          <Bell className="!size-5" />
          <Badge className="absolute right-1 top-0 flex size-4 items-center justify-center rounded-full p-0 text-2xs">
            3
          </Badge>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto border-0 p-0 shadow-none" side="top" align="end">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>You have 3 unread messages.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center space-x-4 rounded-md border p-4">
              <BellRing />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium leading-none">Push Notifications</p>
                <p className="text-sm text-muted-foreground">Send notifications to device.</p>
              </div>
              <Switch />
            </div>
            <div>
              {notifications.map((notification, index) => (
                <div key={index} className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0">
                  <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <Check /> Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
