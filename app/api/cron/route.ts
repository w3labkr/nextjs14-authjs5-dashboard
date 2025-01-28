import type { NextRequest } from 'next/server'

export function GET(request: NextRequest) {
  const authorization = request.headers.get('authorization')

  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  return Response.json({ success: true })
}
