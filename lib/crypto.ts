import { type NextRequest } from 'next/server'
import * as crypto from 'crypto'

export function uuidv4() {
  return crypto.randomUUID()
}

export function generateCsrfToken(size: number = 32) {
  return crypto.randomBytes(size).toString('hex')
}

export function verifyCsrfToken(req: NextRequest) {
  const s = req.cookies.get('_self.csrf-token')?.value
  const x = req.headers.get('X-CSRF-Token')
  return !!s && !!x && s === x
}

export function verifyAjax(req: NextRequest) {
  const x = req.headers.get('X-Requested-With')
  return !!x && x === 'XMLHttpRequest'
}

export function verifyCsrfAndAjax(req: NextRequest) {
  return verifyAjax(req) ? verifyCsrfToken(req) : false
}
