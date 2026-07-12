import { useEffect, useState, useCallback } from 'react'
import {
  getPeminjaman,
  getPeminjamanById,
  getPeminjamanByKode,
  getPeminjamanMenunggu,
  getPeminjamanAktif,
  Peminjaman,
} from '@/lib/data/peminjaman'

export function usePeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([])

  const refresh = useCallback(() => {
    getPeminjaman()
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanMenunggu() {
  const [data, setData] = useState<Peminjaman[]>([])

  const refresh = useCallback(() => {
    getPeminjamanMenunggu()
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanAktif() {
  const [data, setData] = useState<Peminjaman[]>([])

  const refresh = useCallback(() => {
    getPeminjamanAktif()
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanById(id: string) {
  const [data, setData] = useState<Peminjaman | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!id) return
    setLoading(true)
    getPeminjamanById(id)
      .then((d) => setData(d ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh }
}

export function usePeminjamanByKode(kode: string) {
  const [data, setData] = useState<Peminjaman | null | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(() => {
    if (!kode) return
    setLoading(true)
    getPeminjamanByKode(kode)
      .then((d) => setData(d ?? null))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [kode])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { data, loading, refresh }
}
