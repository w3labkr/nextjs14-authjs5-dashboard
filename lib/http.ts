import { NextResponse, type NextRequest } from 'next/server'
import { STATUS_CODES, STATUS_CODE_TO_TEXT } from '@/lib/http-status-codes/en'
import { absoluteUrl } from '@/lib/utils'

export const xhr = {
  async get<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'GET',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  async head<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'HEAD',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  async post<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  async put<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  async delete<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  async patch<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
}

export class ApiResponse extends NextResponse {
  constructor(body?: BodyInit | null, init?: ResponseInit) {
    super(body, init)
  }
  static json(data: any, init?: ResponseInit & { message?: string }) {
    const status = init?.status ?? STATUS_CODES.OK
    const body: any = {
      status: status >= 200 && status <= 299 ? 'success' : 'fail',
      message: init?.message ?? STATUS_CODE_TO_TEXT[status?.toString()],
      success: status >= 200 && status <= 299,
      data,
    }
    if (init?.message) delete init.message
    return super.json(body, init)
  }
}
