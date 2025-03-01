'use client'

import * as React from 'react'
import Link from 'next/link'

import { Command } from 'lucide-react'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/custom-ui/sidebar'

import app from '@/config/app'

export function NavBrand() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton size="lg" asChild>
          <Link href="/dashboard">
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <Command className="size-4" />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">{app.title}</span>
              <span className="truncate text-xs">{app.version}</span>
            </div>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
