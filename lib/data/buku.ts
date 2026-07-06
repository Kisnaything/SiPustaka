// lib/data/buku.ts
import { supabase } from '@/lib/supabase/client'

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
  cover: string | null
  preview: string | null
  sinopsis: string
}

// ─── GET ALL ────────────────────────────────────────────────
export async function getBooks(): Promise<Buku[]> {
  const { data, error } = await supabase
    .from('buku')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error (getBooks):', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return []
  }
  return data || []
}

// ─── GET BY ID ──────────────────────────────────────────────
export async function getBookById(id: string): Promise<Buku | null> {
  const { data, error } = await supabase
    .from('buku')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error (getBookById):', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return null
  }
  return data
}

// ─── ADD ────────────────────────────────────────────────────
export async function addBook(book: Omit<Buku, 'id'>): Promise<Buku | null> {
  const { data, error } = await supabase
    .from('buku')
    .insert([book])
    .select()
    .single()

  if (error) {
    console.error('Supabase error (addBook):', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return null
  }
  return data
}

// ─── UPDATE ─────────────────────────────────────────────────
export async function updateBook(id: string, data: Partial<Buku>): Promise<Buku | null> {
  const { data: updated, error } = await supabase
    .from('buku')
    .update(data)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error (updateBook):', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return null
  }
  return updated
}

// ─── DELETE ─────────────────────────────────────────────────
export async function deleteBook(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('buku')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase error (deleteBook):', error.message)
    console.error('Full error:', JSON.stringify(error, null, 2))
    return false
  }
  return true
}