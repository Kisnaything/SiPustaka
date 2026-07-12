import { NextRequest, NextResponse } from 'next/server'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function getAdminUserId(): Promise<string> {
  // Cari admin dari auth.users — register-admin menyimpan role = 'admin'
  // di user_metadata, tapi gak insert ke tabel public users
  const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
    headers: {
      apikey: SERVICE_KEY,
      Authorization: `Bearer ${SERVICE_KEY}`,
    },
  })
  if (!res.ok) throw new Error('Gagal mendapatkan daftar auth users')
  const data = await res.json()
  const admin = (data.users || []).find((u: any) =>
    u.user_metadata?.role === 'admin'
  )
  if (!admin?.id) throw new Error('Admin tidak ditemukan')
  return admin.id
}

export async function GET() {
  try {
    const adminId = await getAdminUserId()
    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminId}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    })
    if (!res.ok) {
      const text = await res.text()
      console.error('Auth API error:', text)
      return NextResponse.json({ norek: '' })
    }
    const user = await res.json()
    return NextResponse.json({ norek: user?.user_metadata?.norek || '' })
  } catch {
    return NextResponse.json({ norek: '' })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { norek } = await request.json()
    const adminId = await getAdminUserId()

    const getRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminId}`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
    })
    if (!getRes.ok) throw new Error('Gagal mendapatkan user auth')
    const user = await getRes.json()

    const putRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${adminId}`, {
      method: 'PUT',
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_metadata: { ...(user.user_metadata || {}), norek },
      }),
    })
    if (!putRes.ok) {
      const text = await putRes.text()
      console.error('Auth API PUT error:', text)
      throw new Error('Gagal menyimpan norek')
    }

    return NextResponse.json({ norek })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
