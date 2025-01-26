import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetcher<T>(input: string, init?: RequestInit): Promise<T> {
  if (/^\//.test(input)) input = absoluteUrl(input)
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type')
  if (!res.ok) throw new Error(res.statusText)
  if (!contentType?.includes('application/json')) {
    throw new Error('Unsupported Media Type')
  }
  return await (res.json() as Promise<T>)
}

export async function fetcherText(input: string, init?: RequestInit): Promise<string> {
  if (/^\//.test(input)) input = absoluteUrl(input)
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type')
  if (!res.ok) throw new Error(res.statusText)
  if (!contentType?.includes('text/plain')) {
    throw new Error('Unsupported Media Type')
  }
  return await res.text()
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function absoluteUrl(url: string | URL, base?: string | URL) {
  return new URL(url, base ?? process.env.NEXT_PUBLIC_APP_URL!).toString()
}

export function relativeUrl(url: string) {
  const new_url = new URL(url)

  return new_url.toString().substring(new_url.origin.length)
}
