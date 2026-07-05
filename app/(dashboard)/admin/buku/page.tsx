'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  BookOpen,
} from 'lucide-react';
import { useBuku } from '@/lib/hooks/useBuku';
import { deleteBook } from '@/lib/data/buku';

type Status = 'Tersedia' | 'Hampir Habis' | 'Kosong';

const statusStyles: Record<Status, string> = {
  Tersedia: 'bg-[#DCFCE7] text-[#16A34A]',
  'Hampir Habis': 'bg-[#FDECC8] text-[#B45309]',
  Kosong: 'bg-[#FEE2E2] text-[#DC2626]',
};

const dotStyles: Record<Status, string> = {
  Tersedia: 'bg-[#16A34A]',
  'Hampir Habis': 'bg-[#B45309]',
  Kosong: 'bg-[#DC2626]',
};

const getStatus = (stok: number): Status => {
  if (stok === 0) return 'Kosong';
  if (stok <= 3) return 'Hampir Habis';
  return 'Tersedia';
};

const coverColors: Record<string, string> = {
  'Sains & Tek': 'bg-[#F97316]',
  'Self Improvement': 'bg-[#D9C6A5]',
  Bisnis: 'bg-[#1E293B]',
  Sejarah: 'bg-[#F5F0E6]',
  'Sastra Indonesia': 'bg-[#8B5A2B]',
  Puisi: 'bg-[#A67B5B]',
  'Fiksi Ilmiah': 'bg-[#2C3E50]',
};

export default function BukuPage() {
  const books = useBuku(); // ← ambil data dari shared store
  const [search, setSearch] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Yakin ingin menghapus buku ini?')) {
      deleteBook(id);
    }
  };

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    return (
      b.judul.toLowerCase().includes(q) ||
      b.penulis.toLowerCase().includes(q) ||
      b.isbn.includes(q)
    );
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Koleksi Buku</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Total {books.length} judul buku terdaftar dalam sistem.
          </p>
        </div>
        <Link
          href="/admin/buku/tambah"
          className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah Buku Baru
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 bg-[#FFF8EE] border border-[#F3E5C8] rounded-xl px-4 py-3 mt-6">
        <div className="flex items-center gap-2 flex-1 bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
          <Search size={16} className="text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul, ISBN, atau penulis..."
            className="flex-1 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] outline-none bg-transparent"
          />
        </div>

        <button className="flex items-center gap-1.5 text-[14px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
          Semua Kategori
          <ChevronDown size={16} className="text-[#9CA3AF]" />
        </button>

        <button className="flex items-center gap-1.5 text-[14px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
          Status Stok
          <ChevronDown size={16} className="text-[#9CA3AF]" />
        </button>

        <button className="flex items-center gap-1.5 text-[14px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5">
          <Filter size={15} className="text-[#9CA3AF]" />
          Lainnya
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-4 overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Judul &amp; Penulis
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                ISBN
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Kategori
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Stok
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Status
              </th>
              <th className="text-right text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredBooks.map((book, index) => {
              const status = getStatus(book.stok);
              const coverColor = coverColors[book.kategori] || 'bg-[#9CA3AF]';
              return (
                <tr
                  key={book.id}
                  className={index !== filteredBooks.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-12 rounded-md flex items-center justify-center shrink-0 ${coverColor}`}
                      >
                        <BookOpen size={16} className="text-white/70" />
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#111827]">
                          {book.judul}
                        </p>
                        <p className="text-[13px] text-[#585F6C]">{book.penulis}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[14px] text-[#585F6C]">{book.isbn}</td>
                  <td className="px-6 py-4">
                    <span className="text-[12px] font-medium text-[#2563EB] bg-[#DBEAFE] px-2.5 py-1 rounded-md">
                      {book.kategori}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-[14px] font-semibold text-[#111827]">
                    {book.stok}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full ${statusStyles[status]}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles[status]}`} />
                      {status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/buku/edit/${book.id}`}
                        className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#585F6C]"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(book.id)}
                        className="p-1.5 rounded-md hover:bg-[#FEE2E2] text-[#DC2626]"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#585F6C]">
            Menampilkan {filteredBooks.length} dari {books.length} buku
          </p>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-md border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB]">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-md text-[13px] font-semibold ${
                  p === 1 ? 'bg-[#B45309] text-white' : 'text-[#585F6C] hover:bg-[#F9FAFB]'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-[#9CA3AF] px-1">...</span>
            <button className="w-8 h-8 rounded-md text-[13px] font-semibold text-[#585F6C] hover:bg-[#F9FAFB]">
              125
            </button>
            <button className="p-1.5 rounded-md border border-[#E5E7EB] text-[#585F6C] hover:bg-[#F9FAFB]">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}