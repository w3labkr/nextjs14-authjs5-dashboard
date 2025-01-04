"use client"

import * as React from "react"
import Link from "next/link"
import {
  ArrowUpRight,
  Link2,
  MoreHorizontal,
  StarOff,
  Trash2,
} from "lucide-react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/custom-ui/sidebar"

import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { useWorkspaceStore } from "@/store/workspace-store"
import { absoluteUrl } from "@/lib/utils"

export function NavFavorites() {
  const { isMobile } = useSidebar()
  const [copiedText, copy] = useCopyToClipboard()
  const favorites = useWorkspaceStore((state) => state.favorites)
  const { delFavorite } = useWorkspaceStore((state) => state)

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {favorites.map((favorite) => (
          <SidebarMenuItem key={favorite.name}>
          <SidebarMenuButton asChild>
            <Link href={favorite.url} title={favorite.name}>
              <span>{favorite.emoji}</span>
              <span>{favorite.name}</span>
            </Link>
          </SidebarMenuButton>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuAction showOnHover>
                <MoreHorizontal />
                <span className="sr-only">More</span>
              </SidebarMenuAction>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align={isMobile ? "end" : "start"}
            >
              <DropdownMenuItem onClick={() => delFavorite(favorite.url)}>
                <StarOff className="text-muted-foreground" />
                <span>Remove from Favorites</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => copy(absoluteUrl(favorite.url))}>
                <Link2 className="text-muted-foreground" />
                <span>Copy Link</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.open(absoluteUrl(favorite.url))}>
                <ArrowUpRight className="text-muted-foreground" />
                <span>Open in New Tab</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Trash2 className="text-muted-foreground" />
                <span>Delete</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}
