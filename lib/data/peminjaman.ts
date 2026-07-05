// lib/data/peminjaman.ts

export interface Peminjaman {
  id: string;
  kode_peminjaman: string;
  anggota_id: string;
  anggota_nama: string;
  buku_id: string;
  buku_judul: string;
  tanggal_reservasi: string;
  tanggal_pinjam: string | null;
  jatuh_tempo: string | null;
  status: 'Menunggu Konfirmasi' | 'Aktif' | 'Selesai' | 'Dibatalkan';
  denda: number;
  hariTerlambat: number;
  status_denda: 'Belum Lunas' | 'Menunggu Verifikasi' | 'Lunas' | 'Ditolak' | null;
  pesan_ditolak: string | null;
}

const STORAGE_KEY = 'sipustaka_peminjaman';
const MAKS_PINJAM_ANGGOTA = 3; // ← batas maks buku per anggota
const DURASI_PINJAM_HARI = 5;   // ← durasi pinjam 5 hari kerja

// ─── Data Default ─────────────────────────────────────────────
const defaultPeminjaman: Peminjaman[] = [
  {
    id: '1',
    kode_peminjaman: 'PMJ-20260705-001',
    anggota_id: '1',
    anggota_nama: 'Budi Raharjo',
    buku_id: '1',
    buku_judul: 'Bumi Manusia',
    tanggal_reservasi: new Date().toISOString(),
    tanggal_pinjam: null,
    jatuh_tempo: null,
    status: 'Menunggu Konfirmasi',
    denda: 0,
    hariTerlambat: 0,
    status_denda: null,
    pesan_ditolak: null,
  },
  {
    id: '2',
    kode_peminjaman: 'PMJ-20260705-002',
    anggota_id: '2',
    anggota_nama: 'Siti Aminah',
    buku_id: '2',
    buku_judul: 'Laskar Pelangi',
    tanggal_reservasi: new Date().toISOString(),
    tanggal_pinjam: null,
    jatuh_tempo: null,
    status: 'Menunggu Konfirmasi',
    denda: 0,
    hariTerlambat: 0,
    status_denda: null,
    pesan_ditolak: null,
  },
];

// ─── Load & Save ─────────────────────────────────────────────
function loadPeminjaman(): Peminjaman[] {
  if (typeof window === 'undefined') return defaultPeminjaman;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPeminjaman));
    return defaultPeminjaman;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultPeminjaman;
  }
}

function savePeminjaman(data: Peminjaman[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let peminjamanList: Peminjaman[] = loadPeminjaman();

// ─── Subscribe ─────────────────────────────────────────────
let listeners: (() => void)[] = [];

export function subscribePeminjaman(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => l());
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('custom-storage-update'));
  }
}

// ─── CRUD ──────────────────────────────────────────────────

export function getPeminjaman(): Peminjaman[] {
  peminjamanList = loadPeminjaman();
  return peminjamanList;
}

export function getPeminjamanById(id: string): Peminjaman | undefined {
  return getPeminjaman().find((p) => p.id === id);
}

export function getPeminjamanByKode(kode: string): Peminjaman | undefined {
  return getPeminjaman().find((p) => p.kode_peminjaman === kode);
}

export function getPeminjamanMenunggu(): Peminjaman[] {
  return getPeminjaman().filter((p) => p.status === 'Menunggu Konfirmasi');
}

export function getPeminjamanAktif(): Peminjaman[] {
  return getPeminjaman().filter((p) => p.status === 'Aktif');
}

// Ambil peminjaman aktif atau menunggu untuk anggota tertentu
export function getPeminjamanByAnggota(anggotaId: string): Peminjaman[] {
  return getPeminjaman().filter(
    (p) => p.anggota_id === anggotaId && (p.status === 'Aktif' || p.status === 'Menunggu Konfirmasi')
  );
}

// ─── Generate Kode ──────────────────────────────────────────
function generateKodePeminjaman(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  const todayCount = getPeminjaman().filter((p) =>
    p.kode_peminjaman.startsWith(`PMJ-${dateStr}`)
  ).length;

  const sequence = String(todayCount + 1).padStart(3, '0');
  return `PMJ-${dateStr}-${sequence}`;
}

// ─── Tambah Peminjaman ──────────────────────────────────────
export function addPeminjaman(data: {
  anggota_id: string;
  anggota_nama: string;
  buku_id: string;
  buku_judul: string;
}): { success: boolean; message: string; data?: Peminjaman } {
  // Validasi maks buku per anggota
  const pinjamanAktif = getPeminjamanByAnggota(data.anggota_id);
  if (pinjamanAktif.length >= MAKS_PINJAM_ANGGOTA) {
    return {
      success: false,
      message: `Anggota sudah mencapai batas maksimal ${MAKS_PINJAM_ANGGOTA} buku.`,
    };
  }

  const newPeminjaman: Peminjaman = {
    id: String(Date.now()),
    kode_peminjaman: generateKodePeminjaman(),
    anggota_id: data.anggota_id,
    anggota_nama: data.anggota_nama,
    buku_id: data.buku_id,
    buku_judul: data.buku_judul,
    tanggal_reservasi: new Date().toISOString(),
    tanggal_pinjam: null,
    jatuh_tempo: null,
    status: 'Menunggu Konfirmasi',
    denda: 0,
    hariTerlambat: 0,
    status_denda: null,
    pesan_ditolak: null,
  };

  peminjamanList = [...peminjamanList, newPeminjaman];
  savePeminjaman(peminjamanList);
  notify();
  return { success: true, message: 'Peminjaman berhasil diajukan', data: newPeminjaman };
}

// ─── Konfirmasi Pengambilan (admin) ─────────────────────────
export function konfirmasiPengambilan(kode: string): {
  success: boolean;
  message: string;
  data?: Peminjaman;
} {
  const peminjaman = getPeminjamanByKode(kode);

  if (!peminjaman) {
    return { success: false, message: 'Kode peminjaman tidak ditemukan' };
  }

  if (peminjaman.status !== 'Menunggu Konfirmasi') {
    return { success: false, message: `Status saat ini: ${peminjaman.status}` };
  }

  // Cek apakah sudah lewat 24 jam
  const reservasiDate = new Date(peminjaman.tanggal_reservasi);
  const now = new Date();
  const diffHours = (now.getTime() - reservasiDate.getTime()) / (1000 * 60 * 60);

  if (diffHours > 24) {
    batalkanPeminjaman(kode);
    return {
      success: false,
      message: 'Waktu pengambilan sudah habis (24 jam). Peminjaman dibatalkan.',
    };
  }

  const tanggalPinjam = now.toISOString().split('T')[0];
  const jatuhTempo = new Date();
  jatuhTempo.setDate(jatuhTempo.getDate() + DURASI_PINJAM_HARI); // ← 5 hari kerja

  const updated = {
    ...peminjaman,
    status: 'Aktif' as const,
    tanggal_pinjam: tanggalPinjam,
    jatuh_tempo: jatuhTempo.toISOString().split('T')[0],
  };

  peminjamanList = peminjamanList.map((p) =>
    p.id === peminjaman.id ? updated : p
  );
  savePeminjaman(peminjamanList);
  notify();
  return { success: true, message: 'Peminjaman berhasil dikonfirmasi', data: updated };
}

// ─── Batalkan Peminjaman ────────────────────────────────────
export function batalkanPeminjaman(kode: string): {
  success: boolean;
  message: string;
} {
  const peminjaman = getPeminjamanByKode(kode);

  if (!peminjaman) {
    return { success: false, message: 'Kode peminjaman tidak ditemukan' };
  }

  if (peminjaman.status !== 'Menunggu Konfirmasi') {
    return { success: false, message: 'Peminjaman tidak dapat dibatalkan' };
  }

  peminjamanList = peminjamanList.map((p) =>
    p.id === peminjaman.id ? { ...p, status: 'Dibatalkan' as const } : p
  );
  savePeminjaman(peminjamanList);
  notify();
  return { success: true, message: 'Peminjaman berhasil dibatalkan' };
}

// ─── Selesaikan Peminjaman (pengembalian admin) ─────────────
export function selesaikanPeminjaman(id: string): {
  success: boolean;
  message: string;
  denda?: number;
} {
  const peminjaman = getPeminjamanById(id);

  if (!peminjaman) {
    return { success: false, message: 'Peminjaman tidak ditemukan' };
  }

  if (peminjaman.status !== 'Aktif') {
    return { success: false, message: 'Hanya peminjaman aktif yang bisa diselesaikan' };
  }

  let denda = 0;
  let hariTerlambat = 0;
  if (peminjaman.jatuh_tempo) {
    const jatuhTempo = new Date(peminjaman.jatuh_tempo);
    const now = new Date();
    if (now > jatuhTempo) {
      hariTerlambat = Math.ceil(
        (now.getTime() - jatuhTempo.getTime()) / (1000 * 60 * 60 * 24)
      );
      denda = hariTerlambat * 2000; // Rp 2.000/hari
    }
  }

  const updated = {
    ...peminjaman,
    status: 'Selesai' as const,
    denda,
    hariTerlambat,
    status_denda: denda > 0 ? ('Belum Lunas' as const) : null,
    pesan_ditolak: null,
  };

  peminjamanList = peminjamanList.map((p) =>
    p.id === id ? updated : p
  );
  savePeminjaman(peminjamanList);
  notify();
  return { success: true, message: 'Pengembalian berhasil', denda };
}

// ─── Update Peminjaman ──────────────────────────────────────
export function updatePeminjaman(
  id: string,
  data: Partial<Peminjaman>
): Peminjaman | null {
  let updated: Peminjaman | null = null;
  peminjamanList = peminjamanList.map((p) => {
    if (p.id === id) {
      updated = { ...p, ...data };
      return updated;
    }
    return p;
  });
  if (updated) {
    savePeminjaman(peminjamanList);
    notify();
  }
  return updated;
}

// ─── Verifikasi Denda (admin) ──────────────────────────────
export function verifikasiDenda(
  id: string,
  status: 'Lunas' | 'Ditolak',
  pesan?: string
): {
  success: boolean;
  message: string;
} {
  const peminjaman = getPeminjamanById(id);
  if (!peminjaman) {
    return { success: false, message: 'Peminjaman tidak ditemukan' };
  }

  if (peminjaman.status !== 'Selesai') {
    return { success: false, message: 'Hanya peminjaman selesai yang memiliki denda' };
  }

  if (status === 'Ditolak' && !pesan) {
    return { success: false, message: 'Alasan penolakan harus diisi' };
  }

  const updated = {
    ...peminjaman,
    status_denda: status,
    pesan_ditolak: status === 'Ditolak' ? pesan || null : null,
  };

  peminjamanList = peminjamanList.map((p) =>
    p.id === id ? updated : p
  );
  savePeminjaman(peminjamanList);
  notify();
  return { success: true, message: `Denda berhasil diverifikasi sebagai ${status}` };
}