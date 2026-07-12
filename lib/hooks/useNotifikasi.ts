import { useEffect, useState, useCallback } from 'react'
import { getNotifikasi, Notifikasi } from '@/lib/data/notifikasi'

export function useNotifikasi() {
  const [data, setData] = useState<Notifikasi[]>([])

  const refresh = useCallback(() => {
    getNotifikasi()
      .then(setData)
      .catch(() => {})
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return data
}
