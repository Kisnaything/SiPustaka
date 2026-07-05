// lib/data/anggota.ts

export interface Anggota {
  id: string;
  nama: string;
  email: string;
  telepon: string;
  username: string;
  password: string; // sementara plain, nanti di-hash
  alamat: string;
  instansi: string; // fakultas / instansi
  status: 'AKTIF' | 'NON-AKTIF';
  tanggal_daftar: string;
  // tambahan untuk UI
  pinjaman?: number; // jumlah buku dipinjam (opsional)
}

// Data dummy awal
const initialAnggota: Anggota[] = [
  {
    id: '1',
    nama: 'Budi Raharjo',
    email: 'budi.ra@univ.ac.id',
    telepon: '+62 812-3456-7890',
    username: 'budi.ra',
    password: 'password123',
    alamat: 'Jl. Mulyosari No. 12, Surabaya',
    instansi: 'Teknik Informatika',
    status: 'AKTIF',
    tanggal_daftar: '2023-01-12',
    pinjaman: 3,
  },
  {
    id: '2',
    nama: 'Siti Aminah',
    email: 'siti.am@univ.ac.id',
    telepon: '+62 856-7890-1234',
    username: 'siti.am',
    password: 'password456',
    alamat: 'Jl. Kalimantan No. 5, Surabaya',
    instansi: 'Sains Lingkungan',
    status: 'AKTIF',
    tanggal_daftar: '2023-02-24',
    pinjaman: 0,
  },
  {
    id: '3',
    nama: 'Prof. Dr. Hendra',
    email: 'hendra.eco@univ.ac.id',
    telepon: '+62 811-2233-4455',
    username: 'hendra',
    password: 'password789',
    alamat: 'Jl. Diponegoro No. 8, Surabaya',
    instansi: 'Fakultas Ekonomi',
    status: 'NON-AKTIF',
    tanggal_daftar: '2022-11-15',
    pinjaman: 5,
  },
];

let anggotaList: Anggota[] = [...initialAnggota];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribeAnggota(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// CRUD
export function getAnggota(): Anggota[] {
  return anggotaList;
}

export function getAnggotaById(id: string): Anggota | undefined {
  return anggotaList.find((a) => a.id === id);
}

export function addAnggota(data: Omit<Anggota, 'id' | 'tanggal_daftar'>): Anggota {
  const newId = String(Date.now());
  const newAnggota: Anggota = {
    ...data,
    id: newId,
    tanggal_daftar: new Date().toISOString().split('T')[0], // yyyy-mm-dd
  };
  anggotaList = [...anggotaList, newAnggota];
  notify();
  return newAnggota;
}

export function updateAnggota(id: string, data: Partial<Anggota>): Anggota | null {
  let updated: Anggota | null = null;
  anggotaList = anggotaList.map((a) => {
    if (a.id === id) {
      updated = { ...a, ...data };
      return updated;
    }
    return a;
  });
  if (updated) notify();
  return updated;
}

export function deleteAnggota(id: string): { success: boolean; message?: string } {
  const anggota = getAnggotaById(id);
  if (!anggota) return { success: false, message: 'Anggota tidak ditemukan' };

  // Cek pinjaman aktif (jika ada)
  if (anggota.pinjaman && anggota.pinjaman > 0) {
    return {
      success: false,
      message: 'Anggota tidak dapat dihapus karena masih memiliki peminjaman aktif',
    };
  }

  anggotaList = anggotaList.filter((a) => a.id !== id);
  notify();
  return { success: true };
}