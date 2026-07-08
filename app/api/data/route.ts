import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function supabaseFetch(path: string, options: RequestInit = {}) {
  const url = `${SUPABASE_URL}${path}`
  const res = await fetch(url, {
    ...options,
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `HTTP ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { table, operation, params } = body

    if (!table || !operation) {
      return NextResponse.json({ error: 'Missing table or operation' }, { status: 400 })
    }

    switch (operation) {
      case 'select': {
        const queryParts: string[] = []
        if (params.select) queryParts.push(`select=${params.select}`)
        if (params.eq) {
          const col = params.eq.column
          const val = typeof params.eq.value === 'string' ? `eq.${params.eq.value}` : `eq.${String(params.eq.value)}`
          queryParts.push(`${col}=${val}`)
        }
        if (params.order) {
          queryParts.push(`order=${params.order.column}.${params.order.ascending ? 'asc' : 'desc'}`)
        }
        if (params.limit) queryParts.push(`limit=${params.limit}`)
        const qs = queryParts.length > 0 ? '?' + queryParts.join('&') : ''

        let data = await supabaseFetch(`/rest/v1/${table}${qs}`)

        if (params.single && Array.isArray(data)) {
          data = data[0] || null
        }

        return NextResponse.json({ data })
      }

      case 'insert': {
        const prefer = params.select ? 'return=representation' : 'return=minimal'
        const data = await supabaseFetch(`/rest/v1/${table}`, {
          method: 'POST',
          headers: { Prefer: prefer },
          body: JSON.stringify(params.values),
        })
        if (params.single && Array.isArray(data)) {
          return NextResponse.json({ data: data[0] || null })
        }
        return NextResponse.json({ data })
      }

      case 'update': {
        const col = params.eq.column
        const val = typeof params.eq.value === 'string' ? `eq.${params.eq.value}` : `eq.${String(params.eq.value)}`
        const prefer = params.select ? 'return=representation' : 'return=minimal'
        const data = await supabaseFetch(`/rest/v1/${table}?${col}=${val}`, {
          method: 'PATCH',
          headers: { Prefer: prefer },
          body: JSON.stringify(params.values),
        })
        if (params.single && Array.isArray(data)) {
          return NextResponse.json({ data: data[0] || null })
        }
        return NextResponse.json({ data })
      }

      case 'delete': {
        const col = params.eq.column
        const val = typeof params.eq.value === 'string' ? `eq.${params.eq.value}` : `eq.${String(params.eq.value)}`
        await supabaseFetch(`/rest/v1/${table}?${col}=${val}`, { method: 'DELETE' })
        return NextResponse.json({ success: true })
      }

      default:
        return NextResponse.json({ error: `Unknown operation: ${operation}` }, { status: 400 })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Data API error:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
