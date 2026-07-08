export interface Notifikasi {
  id: string
  pengguna_id: string | null
  judul: string
  pesan: string
  tipe: string
  dibaca: boolean
  created_at: string
}

async function api<T>(body: Record<string, unknown>): Promise<T> {
  const res = await fetch('/api/data', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!res.ok) {
    console.error('API error:', json.error)
    throw new Error(json.error)
  }
  return json.data as T
}

export async function getNotifikasi(): Promise<Notifikasi[]> {
  try {
    return await api<Notifikasi[]>({
      table: 'notifikasi',
      operation: 'select',
      params: { select: '*', order: { column: 'created_at', ascending: false } },
    })
  } catch {
    return []
  }
}

export async function addNotifikasi(data: {
  pengguna_id?: string
  judul: string
  pesan: string
  tipe?: string
}): Promise<Notifikasi | null> {
  try {
    return await api<Notifikasi>({
      table: 'notifikasi',
      operation: 'insert',
      params: {
        values: {
          pengguna_id: data.pengguna_id || null,
          judul: data.judul,
          pesan: data.pesan,
          tipe: data.tipe || 'info',
        },
        select: true,
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function tandaiDibaca(id: string): Promise<Notifikasi | null> {
  try {
    return await api<Notifikasi>({
      table: 'notifikasi',
      operation: 'update',
      params: {
        values: { dibaca: true },
        eq: { column: 'id', value: id },
        select: true,
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function hapusNotifikasi(id: string): Promise<boolean> {
  try {
    await api<null>({
      table: 'notifikasi',
      operation: 'delete',
      params: { eq: { column: 'id', value: id } },
    })
    return true
  } catch {
    return false
  }
}
