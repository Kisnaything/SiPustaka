// lib/hooks/useAnggota.ts
import { useEffect, useState } from 'react'
import { getAnggota, getAnggotaById, Anggota } from '@/lib/data/anggota'

export function useAnggota() {
  const [anggota, setAnggota] = useState<Anggota[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnggota = async () => {
    setLoading(true)
    const data = await getAnggota()
    setAnggota(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchAnggota()
  }, [])

  return { anggota, loading, refetch: fetchAnggota }
}

export function useAnggotaById(id: string) {
  const [anggota, setAnggota] = useState<Anggota | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchAnggota = async () => {
    setLoading(true)
    const data = await getAnggotaById(id)
    setAnggota(data)
    setLoading(false)
  }

  useEffect(() => {
    if (id) fetchAnggota()
  }, [id])

  return { anggota, loading, refetch: fetchAnggota }
}