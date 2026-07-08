export interface Anggota {
  id: string
  nama: string
  email: string
  telepon: string
  alamat: string
  instansi: string
  role: string
  username?: string
  status: 'AKTIF' | 'NON-AKTIF'
  tanggal_daftar: string
  total_pinjaman?: number
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
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

export async function getAnggota(): Promise<Anggota[]> {
  try {
    return await api<Anggota[]>({
      table: 'users',
      operation: 'select',
      params: {
        select: '*',
        order: { column: 'created_at', ascending: false },
      },
    })
  } catch {
    return []
  }
}

export async function getAnggotaById(id: string): Promise<Anggota | null> {
  try {
    return await api<Anggota>({
      table: 'users',
      operation: 'select',
      params: {
        select: '*',
        eq: { column: 'id', value: id },
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function addAnggota(anggota: Omit<Anggota, 'id' | 'tanggal_daftar' | 'role'>): Promise<Anggota | null> {
  const id = generateId()
  try {
    return await api<Anggota>({
      table: 'users',
      operation: 'insert',
      params: {
        values: {
          id,
          nama: anggota.nama,
          email: anggota.email,
          telepon: anggota.telepon,
          alamat: anggota.alamat,
          instansi: anggota.instansi,
          role: 'member',
          status: anggota.status,
          tanggal_daftar: new Date().toISOString().split('T')[0],
        },
        select: true,
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function updateAnggota(id: string, data: Partial<Anggota>): Promise<Anggota | null> {
  const updateData: Record<string, unknown> = { ...data }
  delete updateData.role
  try {
    return await api<Anggota>({
      table: 'users',
      operation: 'update',
      params: {
        values: updateData,
        eq: { column: 'id', value: id },
        select: true,
        single: true,
      },
    })
  } catch {
    return null
  }
}

export async function deleteAnggota(id: string): Promise<boolean> {
  try {
    await api<null>({
      table: 'users',
      operation: 'delete',
      params: { eq: { column: 'id', value: id } },
    })
    return true
  } catch {
    return false
  }
}
