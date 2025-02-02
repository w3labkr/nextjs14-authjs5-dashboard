import * as React from 'react'
import { PricingTable } from '@/components/pricing-table'

export default function PricingPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <PricingTable />
    </div>
  )
}
