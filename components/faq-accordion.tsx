'use client'

import * as React from 'react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { uuidv4 } from '@/lib/crypto'

interface FAQ {
  question: string
  answer: string
}

const data: FAQ[] = [
  {
    question: 'What is Vercel?',
    answer:
      'Vercel is a cloud platform for static sites and Serverless Functions that fits perfectly with your workflow. It enables developers to host Jamstack websites and web services that deploy instantly, scale automatically, and requires no supervision, all with no configuration.',
  },
  {
    question: 'How do I deploy my Next.js app on Vercel?',
    answer:
      'To deploy your Next.js app on Vercel, you can connect your GitHub repository to Vercel and it will automatically deploy your app with each push to the main branch. Alternatively, you can use the Vercel CLI to deploy from your local machine.',
  },
  {
    question: 'What are the benefits of using Vercel?',
    answer:
      'Vercel offers numerous benefits including automatic deployments, instant rollbacks, serverless functions, edge caching, custom domains, and HTTPS by default. It also provides an excellent developer experience with features like preview deployments for pull requests.',
  },
  {
    question: 'Is Vercel only for Next.js projects?',
    answer:
      'While Vercel is optimized for Next.js, it supports a wide range of frontend frameworks and static site generators including React, Vue, Angular, Svelte, Nuxt, Gatsby, and many more.',
  },
  {
    question: 'How does Vercel handle environment variables?',
    answer:
      'Vercel allows you to set environment variables in the Vercel dashboard or via the Vercel CLI. These variables can be used in your application and are securely encrypted. You can also use different values for Production, Preview, and Development environments.',
  },
]

export function FAQAccordion() {
  return (
    <Accordion type="single" collapsible className="w-full">
      {data?.map((faq, index) => (
        <AccordionItem key={uuidv4()} value={`item-${index}`}>
          <AccordionTrigger>{faq?.question}</AccordionTrigger>
          <AccordionContent>{faq?.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
