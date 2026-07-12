import { addNotifikasi } from './notifikasi'

export interface Buku {
  id: string
  judul: string
  penulis: string
  kategori: string
  penerbit: string
  tahun: number
  cetakan: string
  isbn: string
  stok: number
  kode_rak: string
  kondisi: string
  cover: string | null
  preview: string | null
  sinopsis: string
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

export async function getBooks(): Promise<Buku[]> {
  try {
    return await api<Buku[]>({
      table: 'buku',
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

export async function getBookById(id: string): Promise<Buku | null> {
  try {
    return await api<Buku>({
      table: 'buku',
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

export async function addBook(book: Omit<Buku, 'id'>): Promise<Buku | null> {
  try {
    const result = await api<Buku>({
      table: 'buku',
      operation: 'insert',
      params: {
        values: book,
        select: true,
        single: true,
      },
    })
    if (result) {
      addNotifikasi({
        judul: 'Buku Baru',
        pesan: `Buku "${result.judul}" telah ditambahkan ke perpustakaan`,
        tipe: 'buku_baru',
      })
    }
    return result
  } catch {
    return null
  }
}

export async function updateBook(id: string, data: Partial<Buku>): Promise<Buku | null> {
  try {
    const result = await api<Buku>({
      table: 'buku',
      operation: 'update',
      params: {
        values: data,
        eq: { column: 'id', value: id },
        select: true,
        single: true,
      },
    })
    if (result && data.judul) {
      addNotifikasi({
        judul: 'Buku Diperbarui',
        pesan: `Buku "${result.judul}" telah diperbarui`,
        tipe: 'buku_diedit',
      })
    }
    return result
  } catch {
    return null
  }
}

export async function deleteBook(id: string): Promise<boolean> {
  try {
    await api<null>({
      table: 'buku',
      operation: 'delete',
      params: { eq: { column: 'id', value: id } },
    })
    return true
  } catch {
    return false
  }
}
