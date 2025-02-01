import { SignJWT, jwtVerify, type JWTPayload, type JWTVerifyOptions } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export { decodeJwt } from 'jose'

export type Token = { sub: string; iat: number; exp: number }

export function verifyJWT<JSON = JWTPayload>(jwt: string | Uint8Array, options?: JWTVerifyOptions) {
  return jwtVerify(jwt, secret, options)
    .then((res) => res.payload as JSON)
    .catch(() => null)
}

export async function jwtSign(payload: JWTPayload, exp: number | string | Date = '1h') {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuedAt()
    .setExpirationTime(exp)
    .sign(secret)
}

export async function generateVerificationToken(sub: string) {
  return await new SignJWT()
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

export async function generateRefreshToken(sub: string) {
  return await new SignJWT()
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setSubject(sub)
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(secret)
}
