import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface Favorite {
  name: string
  url: string
  emoji: string
}

interface WorkspaceState {
  favorites: Favorite[]
  addFavorite: (favorite: Favorite) => void
  delFavorite: (url: string) => void
}

export const useWorkspaceStore = create(
  persist<WorkspaceState>(
    (set) => ({
      favorites: [],
      addFavorite: (favorite) => set((state) => ({ favorites: [...state.favorites, favorite] })),
      delFavorite: (url) => set((state) => ({ favorites: state.favorites.filter((x) => x.url !== url) })),
    }),
    {
      name: 'workspace-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
