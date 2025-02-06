import csrf from 'csrf'

const tokens = new csrf()
const secret = process.env.CSRF_SECRET || tokens.secretSync()

export function verifyCSRFToken(token: string) {
  return tokens.verify(secret, token)
}
