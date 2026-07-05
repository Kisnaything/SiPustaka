// lib/hooks/useBuku.ts
import { useEffect, useState } from 'react';
import { getBooks, getBookById, subscribe, Buku } from '@/lib/data/buku';

// Hook untuk semua buku
export function useBuku() {
  const [books, setBooks] = useState<Buku[]>([]);

  const refresh = () => {
    setBooks(getBooks());
  };

  useEffect(() => {
    refresh();

    const unsubscribe = subscribe(refresh);

    // Listener untuk storage event (sinkron antar tab)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_buku') {
        refresh();
      }
    };

    // Juga tangkap event custom yang kita dispatch dari add/update/delete
    const handleCustom = () => refresh();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, []);

  return books;
}

// Hook untuk satu buku (by id)
export function useBukuById(id: string) {
  const [book, setBook] = useState<Buku | undefined>(undefined);

  const refresh = () => {
    setBook(getBookById(id));
  };

  useEffect(() => {
    refresh();

    const unsubscribe = subscribe(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_buku') {
        refresh();
      }
    };
    const handleCustom = () => refresh();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, [id]);

  return book;
}