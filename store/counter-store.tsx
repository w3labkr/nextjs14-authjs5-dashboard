import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface CounterState {
  count: number
  increase: () => void
  decrease: () => void
}

export const useCounterStore = create(
  persist<CounterState>(
    (set) => ({
      count: 0,
      increase: () => set((state) => ({ count: state.count + 1 })),
      decrease: () => set((state) => ({ count: state.count - 1 })),
    }),
    {
      name: 'counter-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    }
  )
)
