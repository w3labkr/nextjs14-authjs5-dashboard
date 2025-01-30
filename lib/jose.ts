import { SignJWT, jwtVerify, type JWTPayload, type JWTVerifyOptions } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

export { decodeJwt } from 'jose'

export async function verifyJWT<JSON = JWTPayload>(jwt: string | Uint8Array, options?: JWTVerifyOptions) {
  return jwtVerify(jwt, secret, options)
    .then((res) => res.payload as JSON)
    .catch(() => null)
}

export async function jwtSign(payload: JWTPayload, exp: number | string | Date = '1h') {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime(exp)
    .sign(secret)
  return jwt
}

export async function generateAccessToken(payload: JWTPayload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('1h')
    .sign(secret)
  return jwt
}

export async function generateRefreshToken(payload: JWTPayload) {
  const jwt = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setExpirationTime('30d')
    .sign(secret)
  return jwt
}
