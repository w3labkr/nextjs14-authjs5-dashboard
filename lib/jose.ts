import { SignJWT, decodeJwt, jwtVerify, type JWTPayload, type JWTVerifyOptions } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export { decodeJwt } from 'jose'

// JSON Web Token Claims
// https://www.iana.org/assignments/jwt/jwt.xhtml

export type Token = { sub: string; iat: number; exp: number; [key: string]: any } & JWTPayload

export async function verifyJwt<JSON = JWTPayload>(jwt: string | Uint8Array, options?: JWTVerifyOptions) {
  return jwtVerify(jwt, secret, options)
    .then((res) => res.payload as JSON)
    .catch(() => null)
}

export async function jwtSign(sub: string, exp: number | string | Date = '1h', payload?: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret)
}

export async function generateRecoveryToken(sub: string, payload?: JWTPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('15m')
    .sign(secret)
}

export async function generateAccessToken(sub: string) {
  return await new SignJWT()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('1h')
    .sign(secret)
}

export async function generateRefreshToken(sub: string, jwt?: string | null) {
  if (jwt) {
    const token = decodeJwt<Token>(jwt)
    // If the token is 10 minutes before expiration time
    if (!isTokenExpired(token?.exp, { expiresBefore: 60 * 10 })) {
      return jwt
    }
  }
  return await new SignJWT()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}

/**
 * generateTokenExpiresAt
 *
 * @param expiresIn (seconds) The default value is 3600 (60 minutes)
 * @returns
 */
export function generateTokenExpiresAt(expiresIn: number = 60 * 60) {
  return Math.floor(Date.now() / 1000 + expiresIn)
}

/**
 * isTokenExpired
 *
 * @param expiresAt (Expiration Time) Claim value to set on the JWT Claims Set.
 * @param options
 * @returns
 */
export function isTokenExpired(
  expiresAt: number, // (milliseconds)
  options?: {
    expiresIn?: number // (seconds) The default value is 0
    expiresBefore?: number // (seconds) The default value is 0
  }
) {
  const expiresIn = options?.expiresIn ?? 0
  const expiresBefore = options?.expiresBefore ?? 0
  return Date.now() >= (expiresAt + expiresIn - expiresBefore) * 1000
}
