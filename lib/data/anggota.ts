// lib/data/anggota.ts
import { supabase } from '@/lib/supabase/client'

export interface Anggota {
  id: string
  nama: string
  email: string
  telepon: string
  alamat: string
  instansi: string
  status: 'AKTIF' | 'NON-AKTIF'
  tanggal_daftar: string
  total_pinjaman?: number
}

// ─── Generate ID (fallback jika crypto.randomUUID tidak tersedia) ───
function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  // Fallback: timestamp + random string
  return Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 10)
}

// ─── GET ALL ────────────────────────────────────────────────
export async function getAnggota(): Promise<Anggota[]> {
  const { data, error } = await supabase
    .from('anggota')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Supabase error (getAnggota):', error.message)
    return []
  }
  return data || []
}

// ─── GET BY ID ──────────────────────────────────────────────
export async function getAnggotaById(id: string): Promise<Anggota | null> {
  const { data, error } = await supabase
    .from('anggota')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Supabase error (getAnggotaById):', error.message)
    return null
  }
  return data
}

// ─── ADD ────────────────────────────────────────────────────
export async function addAnggota(anggota: Omit<Anggota, 'id' | 'tanggal_daftar'>): Promise<Anggota | null> {
  // Generate ID menggunakan fungsi fallback
  const id = generateId()

  const { data, error } = await supabase
    .from('anggota')
    .insert([{
      id, // ← kirim ID yang sudah digenerate
      nama: anggota.nama,
      email: anggota.email,
      telepon: anggota.telepon,
      alamat: anggota.alamat,
      instansi: anggota.instansi,
      status_anggota: anggota.status,
      tanggal_daftar: new Date().toISOString().split('T')[0]
    }])
    .select()
    .single()

  if (error) {
    console.error('Supabase error (addAnggota):', error.message)
    console.error('Detail error:', error)
    return null
  }

  // Mapping balik status_anggota → status
  return {
    ...data,
    status: data.status_anggota,
  }
}

// ─── UPDATE ─────────────────────────────────────────────────
export async function updateAnggota(id: string, data: Partial<Anggota>): Promise<Anggota | null> {
  const updateData: any = { ...data }
  if (data.status) {
    updateData.status_anggota = data.status
    delete updateData.status
  }

  const { data: updated, error } = await supabase
    .from('anggota')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error (updateAnggota):', error.message)
    return null
  }

  return {
    ...updated,
    status: updated.status_anggota,
  }
}

// ─── DELETE ─────────────────────────────────────────────────
export async function deleteAnggota(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('anggota')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Supabase error (deleteAnggota):', error.message)
    return false
  }
  return true
}