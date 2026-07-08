export interface Pengaturan {
  id: string
  nama_perpustakaan: string
  denda_per_hari: number
  durasi_pinjam: number
  maks_pinjam_buku: number
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

export async function getPengaturan(): Promise<Pengaturan> {
  try {
    const list = await api<Pengaturan[]>({
      table: 'pengaturan',
      operation: 'select',
      params: { select: '*', limit: 1 },
    })
    if (list.length > 0) return list[0]

    const created = await api<Pengaturan>({
      table: 'pengaturan',
      operation: 'insert',
      params: {
        values: {
          nama_perpustakaan: 'Perpustakaan Umum Daerah SiPustaka',
          denda_per_hari: 2000,
          durasi_pinjam: 5,
          maks_pinjam_buku: 3,
        },
        select: true,
        single: true,
      },
    })
    return created
  } catch {
    return {
      id: '',
      nama_perpustakaan: 'Perpustakaan Umum Daerah SiPustaka',
      denda_per_hari: 2000,
      durasi_pinjam: 5,
      maks_pinjam_buku: 3,
    }
  }
}

export async function updatePengaturan(data: Partial<Pengaturan>): Promise<Pengaturan> {
  const current = await getPengaturan()
  if (!current.id) throw new Error('Pengaturan not found')

  return await api<Pengaturan>({
    table: 'pengaturan',
    operation: 'update',
    params: {
      values: data,
      eq: { column: 'id', value: current.id },
      select: true,
      single: true,
    },
  })
}
