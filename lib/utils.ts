import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { STATUS_CODES, STATUS_CODE_TO_TEXT } from '@/lib/http-status-codes/en'

export const xhr = {
  headers: { 'Content-Type': 'application/json' },
  async get<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'GET', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
  async head<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'HEAD', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
  async post<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'POST', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
  async put<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'PUT', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
  async delete<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'DELETE', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
  async patch<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), { method: 'PATCH', headers: this.headers, ...init }).then(
      (res) => res.json() as Promise<JSON>
    )
  },
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uuidv4() {
  return crypto.randomUUID()
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
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

export class ApiResponse extends Response {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init)
  }

  static json(data: any, init?: ResponseInit) {
    const status = init?.status ?? STATUS_CODES.OK
    const statusText = init?.statusText

    return Response.json(
      {
        status,
        message: statusText ?? STATUS_CODE_TO_TEXT[status?.toString()],
        success: status >= 200 && status <= 299,
        data,
      },
      { ...init }
    )
  }
}
