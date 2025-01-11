'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { Star } from 'lucide-react'

import { Button } from '@/components/ui/button'

import { dashboardConfig } from '@/config/dashboard'
import { useWorkspaceStore } from '@/store/workspace-store'
import { cn } from '@/lib/utils'

export function NavActions() {
  const pathname = usePathname()
  const workspace = dashboardConfig.workspaces.filter((x) => x.url === pathname)[0]

  const favorites = useWorkspaceStore((state) => state.favorites)
  const { addFavorite, delFavorite } = useWorkspaceStore((state) => state)
  const [isFavorite, setIsFavorite] = React.useState<boolean>(false)

  React.useEffect(() => {
    const value = favorites.some((x) => x.url === workspace.url)
    setIsFavorite(value)
  }, [favorites, workspace.url])

  return (
    <div className="flex items-center gap-2 text-sm">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => {
          if (isFavorite) delFavorite(workspace.url)
          else addFavorite(workspace)
        }}
      >
        <Star className={cn(isFavorite ? 'fill-yellow-400 text-yellow-400' : '')} />
      </Button>
    </div>
  )
}
