import { SignJWT, decodeJwt, jwtVerify, type JWTPayload, type JWTVerifyOptions } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export { decodeJwt } from 'jose'

export type Token = { sub: string; iat: number; exp: number }

export async function verifyJWT<JSON = JWTPayload>(jwt: string | Uint8Array, options?: JWTVerifyOptions) {
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
    if (!isTokenExpired(token?.exp)) return jwt
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
 * @param expiresIn (seconds) 3600 = 60 minutes
 * @returns
 */
export function generateTokenExpiresAt(expiresIn: number = 60 * 60) {
  return Math.floor(Date.now() / 1000 + expiresIn)
}

/**
 * isTokenExpired
 *
 * @param exp (milliseconds)
 * @param expiresBefore (seconds) 600 = 10 minutes
 * @returns
 */
export function isTokenExpired(exp: number, expiresBefore: number = 60 * 10) {
  return Date.now() >= (exp - expiresBefore) * 1000
}
