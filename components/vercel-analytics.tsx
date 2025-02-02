import * as React from 'react'
import { Analytics } from '@vercel/analytics/react'

export function VercelAnalytics() {
  if (process.env.NODE_ENV !== 'production') return null

  return <Analytics />
}
