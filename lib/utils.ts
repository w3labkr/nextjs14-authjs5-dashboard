import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { STATUS_CODES, STATUS_TEXTS, STATUS_CODE_TO_TEXT } from "@/lib/http-status-codes"

export const ApiResponse = {
  json: (
    data: any,
    status: number = STATUS_CODES.OK,
    statusText?: string,
    init?: ResponseInit
  ) => {
    return Response.json({
      success: status >= 200 && status <= 299,
      status,
      message: statusText ?? STATUS_CODE_TO_TEXT[status?.toString()],
      data
    }, init)
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function fetcher<T>(input: string, init?: RequestInit): Promise<T> {
  if (/^\//.test(input)) input = absoluteUrl(input)
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type')
  if (!res.ok) throw new Error(res.statusText)
  if (!contentType?.includes('application/json')) {
    throw new Error(STATUS_TEXTS.UNSUPPORTED_MEDIA_TYPE)
  }
  return await (res.json() as Promise<T>)
}

export async function fetcherText(input: string, init?: RequestInit): Promise<string> {
  if (/^\//.test(input)) input = absoluteUrl(input)
  const res = await fetch(input, init)
  const contentType = res.headers.get('content-type')
  if (!res.ok) throw new Error(res.statusText)
  if (!contentType?.includes('text/plain')) {
    throw new Error(STATUS_TEXTS.UNSUPPORTED_MEDIA_TYPE)
  }
  return await res.text()
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function absoluteUrl(url: string | URL, base?: string | URL) {
  return new URL(url, base ?? process.env.NEXT_PUBLIC_APP_URL).toString()
}

export function relativeUrl(url: string) {
  const new_url = new URL(url)

  return new_url.toString().substring(new_url.origin.length)
}
