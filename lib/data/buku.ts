// lib/data/buku.ts
export interface Buku {
  id: string;
  judul: string;
  penulis: string;
  kategori: string;
  penerbit: string;
  tahun: number;
  cetakan: string;
  isbn: string;
  stok: number;
  cover: string | null;
  preview: string | null;
  sinopsis: string;
}

const STORAGE_KEY = 'sipustaka_buku';

// Data default jika localStorage kosong
const defaultBooks: Buku[] = [
  {
    id: '1',
    judul: 'Bumi Manusia',
    penulis: 'Pramoedya Ananta Toer',
    kategori: 'Sastra Indonesia',
    penerbit: 'Lentera Dipantara',
    tahun: 2005,
    cetakan: 'Ke-12',
    isbn: '978-979-97312-3-4',
    stok: 2,
    cover: null,
    preview: null,
    sinopsis: 'Novel ini mengisahkan Minke...',
  },
  {
    id: '2',
    judul: 'Laskar Pelangi',
    penulis: 'Andrea Hirata',
    kategori: 'Sastra Indonesia',
    penerbit: 'Bentang Pustaka',
    tahun: 2005,
    cetakan: 'Ke-20',
    isbn: '978-979-1227-78-2',
    stok: 1,
    cover: null,
    preview: null,
    sinopsis: 'Laskar Pelangi adalah kisah tentang sepuluh anak...',
  },
  {
    id: '3',
    judul: 'Hujan Bulan Juni',
    penulis: 'Sapardi Djoko Damono',
    kategori: 'Puisi',
    penerbit: 'Gramedia',
    tahun: 1994,
    cetakan: 'Ke-5',
    isbn: '978-602-03-1234-5',
    stok: 0,
    cover: null,
    preview: null,
    sinopsis: 'Kumpulan puisi terbaik Sapardi.',
  },
  {
    id: '4',
    judul: 'Supernova',
    penulis: 'Dee Lestari',
    kategori: 'Fiksi Ilmiah',
    penerbit: 'Bentang Pustaka',
    tahun: 2001,
    cetakan: 'Ke-8',
    isbn: '978-602-291-123-4',
    stok: 3,
    cover: null,
    preview: null,
    sinopsis: 'Supernova adalah novel fiksi ilmiah...',
  },
  {
    id: '5',
    judul: 'Cantik Itu Luka',
    penulis: 'Eka Kurniawan',
    kategori: 'Sastra Indonesia',
    penerbit: 'Gramedia',
    tahun: 2002,
    cetakan: 'Ke-6',
    isbn: '978-602-03-2345-6',
    stok: 2,
    cover: null,
    preview: null,
    sinopsis: 'Novel magis-realis...',
  },
  {
    id: '6',
    judul: 'Tetralogi Buru',
    penulis: 'Pramoedya Ananta Toer',
    kategori: 'Sastra Indonesia',
    penerbit: 'Lentera Dipantara',
    tahun: 1980,
    cetakan: 'Ke-3',
    isbn: '978-979-97312-4-1',
    stok: 1,
    cover: null,
    preview: null,
    sinopsis: 'Empat novel epik...',
  },
];

// Fungsi untuk baca dari localStorage
function loadBooks(): Buku[] {
  if (typeof window === 'undefined') return defaultBooks;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // Inisialisasi dengan default jika belum ada
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultBooks));
    return defaultBooks;
  }
  try {
    return JSON.parse(stored);
  } catch {
    return defaultBooks;
  }
}

// Fungsi simpan ke localStorage
function saveBooks(books: Buku[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// In-memory cache (untuk performa, tapi selalu sync dengan localStorage)
let books: Buku[] = loadBooks();

// ─── Subscribe ─────────────────────────────────────────────
let listeners: (() => void)[] = [];

export function subscribe(listener: () => void) {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

function notify() {
  listeners.forEach((l) => l());
}

// ─── CRUD ──────────────────────────────────────────────────

// Ambil semua buku
export function getBooks(): Buku[] {
  // Selalu reload dari localStorage untuk memastikan data terbaru
  books = loadBooks();
  return books;
}

// Ambil satu buku berdasarkan id
export function getBookById(id: string): Buku | undefined {
  books = loadBooks();
  return books.find((b) => b.id === id);
}

// Tambah buku baru
export function addBook(book: Omit<Buku, 'id'>): Buku {
  const newId = String(Date.now());
  const newBook: Buku = { ...book, id: newId };
  books = [...books, newBook];
  saveBooks(books);
  notify();
  // Trigger storage event agar tab lain sinkron
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
  return newBook;
}

// Update buku
export function updateBook(id: string, data: Partial<Buku>): Buku | null {
  let updatedBook: Buku | null = null;
  books = books.map((b) => {
    if (b.id === id) {
      updatedBook = { ...b, ...data };
      return updatedBook;
    }
    return b;
  });
  if (updatedBook) {
    saveBooks(books);
    notify();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('storage'));
    }
  }
  return updatedBook;
}

// Hapus buku
export function deleteBook(id: string): void {
  books = books.filter((b) => b.id !== id);
  saveBooks(books);
  notify();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}

// Reset ke default (untuk testing)
export function resetBooks(): void {
  books = [...defaultBooks];
  saveBooks(books);
  notify();
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('storage'));
  }
}