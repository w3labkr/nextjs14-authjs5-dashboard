import { STATUS_CODES, STATUS_CODE_TO_TEXT } from '@/lib/http-status-codes/en'
import { absoluteUrl } from '@/lib/utils'

export const xhr = {
  headers: { 'Content-Type': 'application/json' },
  get<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'GET',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  head<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'HEAD',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  post<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'POST',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  put<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'PUT',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  delete<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'DELETE',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
  patch<JSON = any>(input: RequestInfo | URL, init?: RequestInit) {
    return fetch(absoluteUrl(input.toString()), {
      ...init,
      method: 'PATCH',
      headers: { ...this.headers, ...init?.headers },
    }).then((res) => res.json() as Promise<JSON>)
  },
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
