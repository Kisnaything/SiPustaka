// lib/hooks/usePeminjaman.ts
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

export function usePeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);

  const refresh = () => setData(getPeminjaman());

  useEffect(() => {
    refresh();
    const unsubscribe = subscribePeminjaman(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_peminjaman') refresh();
    };
    const handleCustom = () => refresh();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, []);

  return data;
}

export function usePeminjamanMenunggu() {
  const [data, setData] = useState<Peminjaman[]>([]);

  const refresh = () => setData(getPeminjamanMenunggu());

  useEffect(() => {
    refresh();
    const unsubscribe = subscribePeminjaman(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_peminjaman') refresh();
    };
    const handleCustom = () => refresh();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, []);

  return data;
}

export function usePeminjamanAktif() {
  const [data, setData] = useState<Peminjaman[]>([]);

  const refresh = () => setData(getPeminjamanAktif());

  useEffect(() => {
    refresh();
    const unsubscribe = subscribePeminjaman(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_peminjaman') refresh();
    };
    const handleCustom = () => refresh();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, []);

  return data;
}

export function usePeminjamanById(id: string) {
  const [data, setData] = useState<Peminjaman | undefined>();

  const refresh = () => setData(getPeminjamanById(id));

  useEffect(() => {
    refresh();
    const unsubscribe = subscribePeminjaman(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_peminjaman') refresh();
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

  return data;
}

export function usePeminjamanByKode(kode: string) {
  const [data, setData] = useState<Peminjaman | undefined>();

  const refresh = () => setData(getPeminjamanByKode(kode));

  useEffect(() => {
    refresh();
    const unsubscribe = subscribePeminjaman(refresh);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_peminjaman') refresh();
    };
    const handleCustom = () => refresh();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('custom-storage-update', handleCustom);

    return () => {
      unsubscribe();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('custom-storage-update', handleCustom);
    };
  }, [kode]);

  return data;
}