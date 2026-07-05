// lib/hooks/useBuku.ts
import { useEffect, useState } from 'react';
import { getBooks, getBookById, subscribe, Buku } from '@/lib/data/buku';

// Hook untuk daftar semua buku (reaktif)
export function useBuku() {
  const [books, setBooks] = useState<Buku[]>([]);

  useEffect(() => {
    // Ambil data awal
    setBooks(getBooks());

    // Subscribe ke perubahan
    const unsubscribe = subscribe(() => {
      setBooks(getBooks());
    });

    return unsubscribe;
  }, []);

  return books;
}

// Hook untuk satu buku berdasarkan id (reaktif)
export function useBukuById(id: string) {
  const [book, setBook] = useState<Buku | undefined>();

  useEffect(() => {
    setBook(getBookById(id));

    const unsubscribe = subscribe(() => {
      setBook(getBookById(id));
    });

    return unsubscribe;
  }, [id]);

  return book;
}