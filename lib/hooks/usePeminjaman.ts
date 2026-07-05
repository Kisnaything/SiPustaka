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

// Semua peminjaman
export function usePeminjaman() {
  const [data, setData] = useState<Peminjaman[]>([]);

  useEffect(() => {
    setData(getPeminjaman());
    const unsubscribe = subscribePeminjaman(() => setData(getPeminjaman()));
    return unsubscribe;
  }, []);

  return data;
}

// Peminjaman Menunggu Konfirmasi
export function usePeminjamanMenunggu() {
  const [data, setData] = useState<Peminjaman[]>([]);

  useEffect(() => {
    setData(getPeminjamanMenunggu());
    const unsubscribe = subscribePeminjaman(() => setData(getPeminjamanMenunggu()));
    return unsubscribe;
  }, []);

  return data;
}

// Peminjaman Aktif
export function usePeminjamanAktif() {
  const [data, setData] = useState<Peminjaman[]>([]);

  useEffect(() => {
    setData(getPeminjamanAktif());
    const unsubscribe = subscribePeminjaman(() => setData(getPeminjamanAktif()));
    return unsubscribe;
  }, []);

  return data;
}

// By ID
export function usePeminjamanById(id: string) {
  const [data, setData] = useState<Peminjaman | undefined>();

  useEffect(() => {
    setData(getPeminjamanById(id));
    const unsubscribe = subscribePeminjaman(() => setData(getPeminjamanById(id)));
    return unsubscribe;
  }, [id]);

  return data;
}

// By Kode
export function usePeminjamanByKode(kode: string) {
  const [data, setData] = useState<Peminjaman | undefined>();

  useEffect(() => {
    setData(getPeminjamanByKode(kode));
    const unsubscribe = subscribePeminjaman(() => setData(getPeminjamanByKode(kode)));
    return unsubscribe;
  }, [kode]);

  return data;
}