# SiPustaka — Sistem Informasi Perpustakaan

Aplikasi web manajemen perpustakaan berbasis Next.js + Supabase.
Punya dua role (Admin & Member) dengan fitur peminjaman,
pengembalian, denda, laporan, dan verifikasi anggota.

## Fitur

- 📚 **Katalog Buku** — Cari buku, filter genre, lihat detail & stok
- 📖 **Peminjaman** — Keranjang → Pinjam → Riwayat peminjaman
- 💰 **Denda** — Upload bukti bayar, verifikasi oleh admin
- 📊 **Laporan** — Grafik tren 7 hari + export data ke CSV
- 👥 **Manajemen Anggota** — CRUD anggota, verifikasi pendaftar baru
- 🖼️ **Cover Buku** — Cover otomatis dari Open Library API
- 📱 **Responsive** — Mobile-friendly dengan sidebar hamburger

## Tech Stack

| Layer | Teknologi |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Bahasa | TypeScript |
| Styling | Tailwind CSS v4 |
| Database | Supabase (PostgreSQL) |
| Autentikasi | Supabase SSR Auth |
| Icons | Tabler Icons + Lucide React |
| Deployment | Vercel |

## Cara Menggunakan

Akses langsung melalui link berikut:

**🔗 https://sipustaka-kappa.vercel.app**

- **Admin** — Login menggunakan akun admin yang sudah didaftarkan
- **Member** — Daftar akun baru melalui halaman registrasi, lalu tunggu verifikasi admin

## Struktur Folder

```
sipustaka/
├── app/
│   ├── (auth)/           # Landing, login, register
│   ├── (dashboard)/
│   │   ├── admin/        # Dashboard admin (10 halaman)
│   │   └── member/       # Dashboard member (6 halaman)
│   ├── api/              # API routes (norek, data, auth)
│   └── page.tsx          # Landing page
├── components/           # UI components (Sidebar, Pagination)
├── lib/                  # Data layer, hooks, Supabase clients
├── scripts/              # Seed data dan utilitas
└── public/               # Aset statis
```

## Lisensi

Project ini dibuat untuk keperluan tugas mata kuliah.
