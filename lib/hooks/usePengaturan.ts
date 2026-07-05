// lib/hooks/usePengaturan.ts
import { useEffect, useState } from 'react';
import { getPengaturan, subscribePengaturan, Pengaturan } from '@/lib/data/pengaturan';

export function usePengaturan() {
  const [data, setData] = useState<Pengaturan>(getPengaturan());

  useEffect(() => {
    setData(getPengaturan());

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sipustaka_pengaturan') {
        setData(getPengaturan());
      }
    };
    const handleCustom = () => setData(getPengaturan());

    const unsubscribe = subscribePengaturan(() => setData(getPengaturan()));
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