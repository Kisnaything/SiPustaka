import { useEffect, useState } from 'react';
import {
  getPeminjaman,
  getPeminjamanById,
  getPeminjamanByKode,
  getPeminjamanMenunggu,
  getPeminjamanAktif,
  subscribePeminjaman,
  Peminjaman,
} from '@/lib/data/peminjaman';

function createStorageHandlers(refresh: () => void) {
  const handleStorage = (e: StorageEvent) => {
    if (e.key === 'sipustaka_peminjaman') refresh();
  };
  const handleCustom = () => refresh();

  window.addEventListener('storage', handleStorage);
  window.addEventListener('custom-storage-update', handleCustom);

  return () => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('custom-storage-update', handleCustom);
  };
}

export function usePeminjaman() {
  const [data, setData] = useState<Peminjaman[]>(getPeminjaman);

  const refresh = () => setData(getPeminjaman());

  useEffect(() => {
    const unsubscribe = subscribePeminjaman(refresh);
    const cleanup = createStorageHandlers(refresh);
    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  return data;
}

export function usePeminjamanMenunggu() {
  const [data, setData] = useState<Peminjaman[]>(getPeminjamanMenunggu);

  const refresh = () => setData(getPeminjamanMenunggu());

  useEffect(() => {
    const unsubscribe = subscribePeminjaman(refresh);
    const cleanup = createStorageHandlers(refresh);
    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  return data;
}

export function usePeminjamanAktif() {
  const [data, setData] = useState<Peminjaman[]>(getPeminjamanAktif);

  const refresh = () => setData(getPeminjamanAktif());

  useEffect(() => {
    const unsubscribe = subscribePeminjaman(refresh);
    const cleanup = createStorageHandlers(refresh);
    return () => {
      unsubscribe();
      cleanup();
    };
  }, []);

  return data;
}

export function usePeminjamanById(id: string) {
  const [data, setData] = useState<Peminjaman | undefined>(() => getPeminjamanById(id));

  const refresh = () => setData(getPeminjamanById(id));

  useEffect(() => {
    const unsubscribe = subscribePeminjaman(refresh);
    const cleanup = createStorageHandlers(refresh);
    return () => {
      unsubscribe();
      cleanup();
    };
  }, [id]);

  return data;
}

export function usePeminjamanByKode(kode: string) {
  const [data, setData] = useState<Peminjaman | undefined>(() => getPeminjamanByKode(kode));

  const refresh = () => setData(getPeminjamanByKode(kode));

  useEffect(() => {
    const unsubscribe = subscribePeminjaman(refresh);
    const cleanup = createStorageHandlers(refresh);
    return () => {
      unsubscribe();
      cleanup();
    };
  }, [kode]);

  return data;
}
