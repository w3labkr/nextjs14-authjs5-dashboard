'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/custom-ui/sidebar'

export function NavWorkspaces({
  workspaces,
}: {
  workspaces: {
    name: string
    url: string
    emoji: string
  }[]
}) {
  const { isMobile } = useSidebar()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Workspaces</SidebarGroupLabel>
      <SidebarMenu>
        {workspaces.map((workspace) => (
          <SidebarMenuItem key={workspace.name}>
            <SidebarMenuButton asChild>
              <Link href={workspace.url} title={workspace.name}>
                <span>{workspace.emoji}</span>
                <span>{workspace.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
