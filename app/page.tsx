"use client";

import Link from "next/link";
import { BookMarked, ArrowRight, BookOpen, ShieldCheck, Bell } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Katalog Buku Digital",
    desc: "Jelajahi koleksi buku perpustakaan secara online dengan pencarian dan filter yang mudah.",
  },
  {
    icon: BookMarked,
    title: "Peminjaman Online",
    desc: "Ajukan peminjaman buku dari mana saja dan kapan saja tanpa perlu datang ke perpustakaan.",
  },
  {
    icon: ShieldCheck,
    title: "Riwayat & Tracker",
    desc: "Pantau status peminjaman, jatuh tempo, dan riwayat peminjaman secara real-time.",
  },
  {
    icon: Bell,
    title: "Notifikasi Denda",
    desc: "Dapatkan pengingat otomatis sebelum masa peminjaman berakhir agar terhindar dari denda.",
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-amber-500 rounded-xl flex items-center justify-center">
              <BookMarked size={18} className="text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900">SiPustaka</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-[13px] font-semibold text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/signup-anggota"
              className="text-[13px] font-semibold text-white bg-amber-500 hover:bg-amber-600 px-5 py-2 rounded-xl transition-colors shadow-sm"
            >
              Daftar
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-6">
            <BookMarked size={14} className="text-amber-600" />
            <span className="text-[12px] font-medium text-amber-700">
              Sistem Informasi Perpustakaan Digital
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight">
            Kelola Perpustakaan{" "}
            <span className="text-amber-600">Lebih Mudah</span>{" "}
            dan Terstruktur
          </h1>

          <p className="mt-5 text-[15px] sm:text-base text-gray-500 leading-relaxed max-w-xl mx-auto">
            SiPustaka membantu Anda mengelola peminjaman buku, anggota, dan
            koleksi perpustakaan dalam satu platform terintegrasi.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup-anggota"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Daftar Anggota
              <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-white border-y border-gray-100 py-16 sm:py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Fitur Unggulan
            </h2>
            <p className="mt-3 text-[14px] text-gray-500 max-w-lg mx-auto">
              Semua yang Anda butuhkan untuk mengelola perpustakaan secara modern
              dan efisien.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="bg-[#FAFAF9] rounded-2xl border border-gray-100 p-6 hover:border-amber-200 hover:shadow-sm transition-all"
                >
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon size={20} className="text-amber-600" />
                  </div>
                  <h3 className="text-[15px] font-bold text-gray-900 mb-2">
                    {f.title}
                  </h3>
                  <p className="text-[13px] text-gray-500 leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Siap Mengelola Perpustakaan?
          </h2>
          <p className="mt-3 text-[14px] text-gray-500">
            Bergabunglah dengan SiPustaka dan kelola perpustakaan Anda dengan
            lebih efisien.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white text-[14px] font-semibold px-7 py-3.5 rounded-xl transition-colors shadow-sm"
            >
              Masuk Sekarang
              <ArrowRight size={17} />
            </Link>
            <Link
              href="/signup-anggota"
              className="w-full sm:w-auto flex items-center justify-center bg-white border border-gray-200 hover:border-amber-300 text-gray-700 text-[14px] font-semibold px-7 py-3.5 rounded-xl transition-colors"
            >
              Daftar Anggota
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
              <BookMarked size={14} className="text-white" />
            </div>
            <span className="text-[13px] font-bold text-gray-900">SiPustaka</span>
          </div>
          <p className="text-[12px] text-gray-400">
            &copy; 2024 SiPustaka. Kelola literasi dengan hati.
          </p>
        </div>
      </footer>
    </main>
  );
}