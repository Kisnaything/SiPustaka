import { useEffect, useState } from 'react'
import { getBooks, getBookById, Buku } from '@/lib/data/buku'

export function useBuku() {
  const [books, setBooks] = useState<Buku[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getBooks()
      .then(data => {
        if (!cancelled) {
          setBooks(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { books, loading, refetch: () => getBooks().then(data => setBooks(data)).catch(() => {}) }
}

export function useBukuById(id: string) {
  const [book, setBook] = useState<Buku | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    let cancelled = false
    getBookById(id)
      .then(data => {
        if (!cancelled) {
          setBook(data)
          setLoading(false)
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [id])

  return { book, loading, refetch: () => getBookById(id).then(data => setBook(data)).catch(() => {}) }
}
