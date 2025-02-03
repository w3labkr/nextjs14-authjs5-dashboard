'use client'

import * as React from 'react'

import { CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export function PaymentMethod() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4">
          <CreditCard className="h-6 w-6" />
          <div>
            <p className="font-medium">Visa ending in 1234</p>
            <p className="text-sm text-gray-500">Expires 12/2025</p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline">Update Payment Method</Button>
      </CardFooter>
    </Card>
  )
}
