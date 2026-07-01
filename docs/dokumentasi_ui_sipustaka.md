# Dokumentasi UI SiPustaka

## Tema & Warna
- **Primary**: Amber 500 (`#f59e0b`), Amber 600 hover (`#d97706`)
- **Primary Light**: Amber 50 (bg), Amber 100 (avatar bg)
- **Background**: Light gray (`#FAFAF9`)
- **Surface**: White (`bg-white`)
- **Text**: Gray 900 (heading), Gray 700 (body), Gray 400 (label/muted)
- **Border**: Gray 100, hover row Gray 50
- **Ring focus**: Amber 400 + Amber 100 ring

## Font
- **Utama**: Plus Jakarta Sans, ui-sans-serif, system-ui, sans-serif
- **Size**: 13px default body, 12px muted, 15px subheader, 20px+ heading
- **Weight**: medium (500) labels, semibold (600) subheaders, bold (700) headings

## Layout
- **Sidebar**: Fixed kiri (200px), white, `border-r border-gray-100`, z-50
- **Topbar**: Sticky (56px / `h-14`), white, `border-b border-gray-100`, z-40
- **Konten**: `main.ml-[200px]` dengan padding `p-6`, bg `#FAFAF9`

## Komponen & Style Guide

### Cards
- `bg-white rounded-2xl border border-gray-100 shadow-sm p-5`

### Buttons
| Tipe | Class |
|------|-------|
| Primary | `bg-amber-500 hover:bg-amber-600 text-white` |
| Secondary | `text-gray-600 hover:bg-gray-100` |
| Icon (edit) | `hover:bg-amber-50 hover:text-amber-600` |
| Icon (hapus) | `hover:bg-red-50 hover:text-red-600` |

### Inputs & Select
- `bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px]`
- `outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100`
- Placeholder: `placeholder:text-gray-400`

### Table
- Header: `bg-gray-50 text-gray-400 px-5 py-3.5 font-medium`
- Body: `text-gray-700 border-t border-gray-50 hover:bg-gray-50/50`
- Status badge: `inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium`

### Status Badges
| Status | Class |
|--------|-------|
| Aktif | `bg-blue-50 text-blue-600` |
| Terlambat | `bg-red-50 text-red-600` |
| Selesai / Tepat Waktu / Dikembalikan | `bg-emerald-50 text-emerald-600` |
| Nonaktif | `bg-gray-50 text-gray-500` |

## Halaman

### Admin Pages (dalam layout sidebar + topbar)

| Route | File | Fitur |
|-------|------|-------|
| `/admin` | Dashboard | Stat cards + tabel peminjaman terbaru + notifikasi |
| `/admin/buku` | Kelola Buku | Tabel buku + search + filter kategori + edit/hapus |
| `/admin/buku/tambah` | Tambah/Edit Buku | Form buku (judul, penulis, kategori, penerbit, thn, ISBN, stok, desc) |
| `/admin/anggota` | Kelola Anggota | Tabel anggota + search + filter status + edit/hapus |
| `/admin/anggota/tambah` | Tambah Anggota | Form anggota (nama, email, telepon, alamat) |
| `/admin/peminjaman` | Peminjaman | Tabel peminjaman + search + filter status |
| `/admin/pengembalian` | Pengembalian | Tabel pengembalian + search + filter status + denda |
| `/admin/verifikasi` | Verifikasi | Tabel pendaftar baru + approve/tolak |
| `/admin/laporan` | Laporan | Stat cards + daftar laporan bulanan + export |
| `/admin/profil` | Profil | Edit profil + upload avatar + ubah password |

### Auth Pages (tanpa sidebar)

| Route | File | Fitur |
|-------|------|-------|
| `/login` | Login | Form email + password, link daftar |
| `/signup` | Daftar | Form nama, email, password, link masuk |

## Pattern Umum
- Setiap halaman diawali `p-6 space-y-6`
- Header halaman: `text-xl font-bold text-gray-900` + `text-[13px] text-gray-400 mt-0.5`
- Baris search + filter: `flex items-center gap-3`
- Tabel dalam container: `bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden`
- Aksi tombol dalam `flex items-center justify-end gap-1`

## State Management
- Belum menggunakan state management global (masih props lokal + data statis)
- Supabase stub files di `lib/` masih kosong
