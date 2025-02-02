import * as React from 'react'

import { SubscriptionPlan } from '@/components/subscription-plan'
import { Usage } from '@/components/usage'
import { PaymentMethod } from '@/components/payment-method'
import { RecentInvoices } from '@/components/recent-invoices'

export default function BillingPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Billing</h2>
        <p className="text-muted-foreground"></p>
      </div>
      <SubscriptionPlan />
      <Usage />
      <PaymentMethod />
      <RecentInvoices />
    </div>
  )
}
