// lib/hooks/useAnggota.ts
import { useEffect, useState } from 'react';
import { getAnggota, getAnggotaById, subscribeAnggota, Anggota } from '@/lib/data/anggota';

export function useAnggota() {
  const [data, setData] = useState<Anggota[]>([]);

  useEffect(() => {
    setData(getAnggota());
    const unsubscribe = subscribeAnggota(() => setData(getAnggota()));
    return unsubscribe;
  }, []);

  return data;
}

export function useAnggotaById(id: string) {
  const [data, setData] = useState<Anggota | undefined>();

  useEffect(() => {
    setData(getAnggotaById(id));
    const unsubscribe = subscribeAnggota(() => setData(getAnggotaById(id)));
    return unsubscribe;
  }, [id]);

  return data;
}