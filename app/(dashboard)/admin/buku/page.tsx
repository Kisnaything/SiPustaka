'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Search,
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useBuku } from '@/lib/hooks/useBuku';
import { deleteBook } from '@/lib/data/buku';
import Pagination from '@/components/Pagination';

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
  'Self Improvement': 'bg-[#D9C6A5]',
  Romance: 'bg-[#E57373]',
  Fantasy: 'bg-[#7B1FA2]',
  'Thriller & Mystery': 'bg-[#37474F]',
  'Young Adult (YA)': 'bg-[#FF8A65]',
  'Business & Finance': 'bg-[#1E293B]',
  'Technology & Artificial Intelligence': 'bg-[#1565C0]',
  Psychology: 'bg-[#4DB6AC]',
  Productivity: 'bg-[#43A047]',
  'Science Fiction (Sci-Fi)': 'bg-[#2C3E50]',
};

export default function BukuPage() {
  const { books, loading } = useBuku();
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [filterKategori, setFilterKategori] = useState('Semua');
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const ITEMS_PER_PAGE = 10;

  const categories = ['Semua', ...new Set(books.map(b => b.kategori))];

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus buku ini?')) {
      await deleteBook(id);
    }
  };

  const filteredBooks = books.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch = b.judul.toLowerCase().includes(q) || b.penulis.toLowerCase().includes(q) || b.isbn.includes(q);
    const matchKategori = filterKategori === 'Semua' || b.kategori === filterKategori;
    return matchSearch && matchKategori;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const paginatedData = filteredBooks.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, filterKategori]);

  if (loading) {
    return <div className="p-6 text-[#585F6C]">Loading...</div>;
  }

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

        <div className="relative">
          <button
            onClick={() => setShowKategoriDropdown(!showKategoriDropdown)}
            className="flex items-center gap-1.5 text-[14px] font-medium text-[#374151] bg-white border border-[#E5E7EB] rounded-lg px-3 py-2.5"
          >
            {filterKategori === 'Semua' ? 'Semua Kategori' : filterKategori}
            <ChevronDown size={16} className="text-[#9CA3AF]" />
          </button>
          {showKategoriDropdown && (
            <div className="absolute top-full left-0 z-10 bg-white border rounded-lg shadow-lg mt-1 min-w-[180px]">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => { setFilterKategori(cat); setShowKategoriDropdown(false) }}
                  className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>
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
            {filteredBooks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-[#9CA3AF]">
                  {search ? 'Tidak ada buku yang sesuai' : 'Belum ada buku terdaftar'}
                </td>
              </tr>
            ) : (
              paginatedData.map((book, index) => {
              const status = getStatus(book.stok);
              const coverColor = coverColors[book.kategori] || 'bg-[#9CA3AF]';
              return (
                <tr
                  key={book.id}
                  className={index !== paginatedData.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-12 rounded-md shrink-0 overflow-hidden ${book.cover ? '' : `flex items-center justify-center ${coverColor}`}`}
                      >
                        {book.cover ? (
                          <img src={book.cover} alt={book.judul} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] text-white/60">Cover</span>
                        )}
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
              })
            )}
          </tbody>
        </table>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredBooks.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}