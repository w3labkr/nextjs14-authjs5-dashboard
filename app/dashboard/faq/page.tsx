import * as React from 'react'
import { FAQAccordion } from '@/components/faq-accordion'

export default function FAQPage() {
  return (
    <div className="flex flex-1 flex-col gap-8 p-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Frequently Asked Questions</h2>
        <p className="text-muted-foreground">
          Find out all the essential details about our platform and how it can serve your needs.
        </p>
      </div>
      <FAQAccordion />
      <div></div>
      <section className="space-y-4 text-center">
        <h2 className="text-2xl font-bold">Still have questions?</h2>
        <p className="text-muted-foreground">
          If you can't find the answer you're looking for, please don't hesitate to reach out to us.
        </p>
      </section>
    </div>
  )
}
