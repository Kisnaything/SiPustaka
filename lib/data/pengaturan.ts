// lib/data/pengaturan.ts

export interface Pengaturan {
  namaPerpustakaan: string;
  dendaPerHari: number;
  durasiPinjam: number; // dalam hari
  maksPinjamBuku: number;
}

const STORAGE_KEY = 'sipustaka_pengaturan';

const defaultPengaturan: Pengaturan = {
  namaPerpustakaan: 'Perpustakaan Umum Daerah SiPustaka',
  dendaPerHari: 2000,
  durasiPinjam: 5,
  maksPinjamBuku: 3,
};

// ─── Load & Save ─────────────────────────────────────────────
function loadPengaturan(): Pengaturan {
  if (typeof window === 'undefined') return defaultPengaturan;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultPengaturan));
    return defaultPengaturan;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultPengaturan;
  }
}

function savePengaturan(data: Pengaturan) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

let pengaturan: Pengaturan = loadPengaturan();

// ─── Subscribe ─────────────────────────────────────────────
let listeners: (() => void)[] = [];

export function subscribePengaturan(listener: () => void) {
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

export function getPengaturan(): Pengaturan {
  pengaturan = loadPengaturan();
  return pengaturan;
}

export function updatePengaturan(data: Partial<Pengaturan>): Pengaturan {
  pengaturan = { ...pengaturan, ...data };
  savePengaturan(pengaturan);
  notify();
  return pengaturan;
}