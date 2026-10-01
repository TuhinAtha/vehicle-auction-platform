// Proxies /api/* from the browser to the NestJS backend.
// API_URL is read at runtime, so the same image works in any environment.
import type { NextRequest } from 'next/server'

export const dynamic = 'force-dynamic'

async function proxy(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params
  const base = process.env.API_URL ?? 'http://localhost:3001'
  const url = `${base}/api/${path.join('/')}${req.nextUrl.search}`
  const hasBody = !['GET', 'HEAD'].includes(req.method)
  const res = await fetch(url, {
    method: req.method,
    headers: {
      'Content-Type': req.headers.get('content-type') ?? 'application/json',
    },
    body: hasBody ? await req.text() : undefined,
    cache: 'no-store',
  })
  return new Response(res.body, {
    status: res.status,
    headers: {
      'Content-Type': res.headers.get('content-type') ?? 'application/json',
    },
  })
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
}
