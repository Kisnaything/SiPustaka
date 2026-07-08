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
    getPeminjaman().then(setData)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanMenunggu() {
  const [data, setData] = useState<Peminjaman[]>([])

  const refresh = useCallback(() => {
    getPeminjamanMenunggu().then(setData)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanAktif() {
  const [data, setData] = useState<Peminjaman[]>([])

  const refresh = useCallback(() => {
    getPeminjamanAktif().then(setData)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanById(id: string) {
  const [data, setData] = useState<Peminjaman | undefined>()

  const refresh = useCallback(() => {
    if (id) getPeminjamanById(id).then((d) => setData(d ?? undefined))
  }, [id])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}

export function usePeminjamanByKode(kode: string) {
  const [data, setData] = useState<Peminjaman | undefined>()

  const refresh = useCallback(() => {
    if (kode) getPeminjamanByKode(kode).then((d) => setData(d ?? undefined))
  }, [kode])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}
