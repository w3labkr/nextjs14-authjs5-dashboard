import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds))
}

export async function fetcher<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
  return fetch(absoluteUrl(input.toString()), init).then((res) => res.json() as Promise<JSON>)
}

export function absoluteUrl(url: string | URL, base?: string | URL) {
  try {
    return new URL(url, base).toString()
  } catch (e: unknown) {
    return new URL(url, process.env.NEXT_PUBLIC_APP_URL!).toString()
  }
}

export function relativeUrl(url: string | URL, base?: string | URL) {
  try {
    const newUrl = new URL(url, base)
    return newUrl.toString().substring(newUrl.origin.length)
  } catch (e: unknown) {
    const newUrl = new URL(url, process.env.NEXT_PUBLIC_APP_URL!)
    return newUrl.toString().substring(newUrl.origin.length)
  }
}
