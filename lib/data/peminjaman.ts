// lib/data/peminjaman.ts

export interface Peminjaman {
  id: string;
  kode_peminjaman: string;
  anggota_id: string;
  anggota_nama: string;
  buku_id: string;
  buku_judul: string;
  tanggal_reservasi: string; // saat anggota ajukan
  tanggal_pinjam: string | null; // diisi admin saat konfirmasi
  jatuh_tempo: string | null;
  status: 'Menunggu Konfirmasi' | 'Aktif' | 'Selesai' | 'Dibatalkan';
  denda: number;
}

// Data dummy awal
const initialPeminjaman: Peminjaman[] = [
  {
    id: '1',
    kode_peminjaman: 'PMJ-20260705-001',
    anggota_id: '1',
    anggota_nama: 'Budi Raharjo',
    buku_id: '1',
    buku_judul: 'Bumi Manusia',
    tanggal_reservasi: '2026-07-05 08:00:00',
    tanggal_pinjam: null,
    jatuh_tempo: null,
    status: 'Menunggu Konfirmasi',
    denda: 0,
  },
  {
    id: '2',
    kode_peminjaman: 'PMJ-20260705-002',
    anggota_id: '2',
    anggota_nama: 'Siti Aminah',
    buku_id: '2',
    buku_judul: 'Laskar Pelangi',
    tanggal_reservasi: '2026-07-05 09:30:00',
    tanggal_pinjam: null,
    jatuh_tempo: null,
    status: 'Menunggu Konfirmasi',
    denda: 0,
  },
  {
    id: '3',
    kode_peminjaman: 'PMJ-20260704-003',
    anggota_id: '3',
    anggota_nama: 'Prof. Dr. Hendra',
    buku_id: '4',
    buku_judul: 'Supernova',
    tanggal_reservasi: '2026-07-04 10:00:00',
    tanggal_pinjam: '2026-07-04 14:30:00',
    jatuh_tempo: '2026-07-18',
    status: 'Aktif',
    denda: 0,
  },
];

// In-memory store
let peminjamanList: Peminjaman[] = [...initialPeminjaman];
let listeners: (() => void)[] = [];

function notify() {
  listeners.forEach((l) => l());
}

export function subscribePeminjaman(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

// ─── CRUD ───

// Ambil semua peminjaman
export function getPeminjaman(): Peminjaman[] {
  return peminjamanList;
}

// Ambil berdasarkan id
export function getPeminjamanById(id: string): Peminjaman | undefined {
  return peminjamanList.find((p) => p.id === id);
}

// Ambil berdasarkan kode
export function getPeminjamanByKode(kode: string): Peminjaman | undefined {
  return peminjamanList.find((p) => p.kode_peminjaman === kode);
}

// Ambil yang statusnya Menunggu Konfirmasi
export function getPeminjamanMenunggu(): Peminjaman[] {
  return peminjamanList.filter((p) => p.status === 'Menunggu Konfirmasi');
}

// Ambil yang statusnya Aktif
export function getPeminjamanAktif(): Peminjaman[] {
  return peminjamanList.filter((p) => p.status === 'Aktif');
}

// Generate kode peminjaman
function generateKodePeminjaman(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;

  // Hitung jumlah peminjaman hari ini
  const todayCount = peminjamanList.filter((p) =>
    p.kode_peminjaman.startsWith(`PMJ-${dateStr}`)
  ).length;

  const sequence = String(todayCount + 1).padStart(3, '0');
  return `PMJ-${dateStr}-${sequence}`;
}

// Tambah peminjaman baru (dipanggil dari sisi member)
export function addPeminjaman(data: {
  anggota_id: string;
  anggota_nama: string;
  buku_id: string;
  buku_judul: string;
}): Peminjaman {
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
  };

  peminjamanList = [...peminjamanList, newPeminjaman];
  notify();

  // ⚠️ Stok buku harus dikurangi di sini (panggil updateBuku)
  // Nanti kita integrasikan dengan lib/data/buku.ts

  return newPeminjaman;
}

// Konfirmasi pengambilan (admin)
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
    return { success: false, message: `Status peminjaman saat ini: ${peminjaman.status}` };
  }

  // Cek apakah sudah lewat 24 jam
  const reservasiDate = new Date(peminjaman.tanggal_reservasi);
  const now = new Date();
  const diffHours = (now.getTime() - reservasiDate.getTime()) / (1000 * 60 * 60);

  if (diffHours > 24) {
    // Otomatis batalkan
    batalkanPeminjaman(kode);
    return {
      success: false,
      message: 'Waktu pengambilan sudah habis (24 jam). Peminjaman dibatalkan.',
    };
  }

  // Konfirmasi
  const tanggalPinjam = new Date().toISOString().split('T')[0];
  const jatuhTempo = new Date();
  jatuhTempo.setDate(jatuhTempo.getDate() + 14);

  const updated = {
    ...peminjaman,
    status: 'Aktif' as const,
    tanggal_pinjam: tanggalPinjam,
    jatuh_tempo: jatuhTempo.toISOString().split('T')[0],
  };

  peminjamanList = peminjamanList.map((p) =>
    p.id === peminjaman.id ? updated : p
  );

  notify();
  return { success: true, message: 'Peminjaman berhasil dikonfirmasi', data: updated };
}

// Batalkan peminjaman (otomatis jika lewat 24 jam, atau manual oleh admin)
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

  notify();
  return { success: true, message: 'Peminjaman berhasil dibatalkan' };
}

// Selesaikan peminjaman (saat buku dikembalikan)
export function selesaikanPeminjaman(id: string): {
  success: boolean;
  message: string;
} {
  const peminjaman = getPeminjamanById(id);

  if (!peminjaman) {
    return { success: false, message: 'Peminjaman tidak ditemukan' };
  }

  if (peminjaman.status !== 'Aktif') {
    return { success: false, message: 'Hanya peminjaman aktif yang bisa diselesaikan' };
  }

  // Hitung denda jika terlambat
  let denda = 0;
  if (peminjaman.jatuh_tempo) {
    const jatuhTempo = new Date(peminjaman.jatuh_tempo);
    const now = new Date();
    if (now > jatuhTempo) {
      const diffDays = Math.ceil(
        (now.getTime() - jatuhTempo.getTime()) / (1000 * 60 * 60 * 24)
      );
      denda = diffDays * 2000; // Rp 2.000/hari
    }
  }

  peminjamanList = peminjamanList.map((p) =>
    p.id === id ? { ...p, status: 'Selesai' as const, denda } : p
  );

  notify();
  return { success: true, message: 'Pengembalian berhasil' };
}