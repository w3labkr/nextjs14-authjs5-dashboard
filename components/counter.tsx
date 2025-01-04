'use client'

import { useCounterStore } from "@/store/counter-store"

export function Counter() {
  const count = useCounterStore((state) => state.count)
  const { increase, decrease } = useCounterStore((state) => state)

  return (
    <div>
      Count: {count}
      <hr />
      <button type="button" onClick={increase}>
        Increment
      </button>
      <button type="button" onClick={decrease}>
        Decrement
      </button>
    </div>
  )
}