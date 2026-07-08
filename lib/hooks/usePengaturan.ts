import { useEffect, useState, useCallback } from 'react'
import { getPengaturan, Pengaturan } from '@/lib/data/pengaturan'

export function usePengaturan() {
  const [data, setData] = useState<Pengaturan>(() => ({
    id: '',
    nama_perpustakaan: 'Perpustakaan Umum Daerah SiPustaka',
    denda_per_hari: 2000,
    durasi_pinjam: 5,
    maks_pinjam_buku: 3,
  }))

  const refresh = useCallback(() => {
    getPengaturan().then(setData)
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}
