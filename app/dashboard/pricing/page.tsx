import * as React from 'react'
import { PricingTable } from '@/components/pricing-table'

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Pricing</h2>
        <p className="text-muted-foreground">Check out our pricing plans to find the one that's best for you.</p>
      </div>
      <PricingTable />
    </div>
  )
}
