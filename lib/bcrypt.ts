import bcrypt from 'bcryptjs'

export async function generateHash(s: string) {
  return await bcrypt.hash(s, 10)
}

export async function compareHash(s: string, hash: string) {
  return await bcrypt.compare(s, hash)
}
