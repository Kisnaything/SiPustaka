'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ImagePlus, Archive, Minus, Plus, Save, ChevronDown } from 'lucide-react';

type Kondisi = 'Baru' | 'Baik' | 'Rusak';

export default function TambahBukuPage() {
  const [stok, setStok] = useState(1);
  const [kondisi, setKondisi] = useState<Kondisi>('Baru');

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-[14px] text-[#9CA3AF] flex items-center gap-2">
        <Link href="/admin/buku" className="hover:text-[#585F6C]">
          Kelola Data Buku
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-[#B45309]">Tambah Buku Baru</span>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-[24px] font-bold text-[#111827]">
          Formulir Pendaftaran Buku
        </h1>
        <p className="text-[14px] text-[#585F6C] mt-1">
          Lengkapi detail buku untuk ditambahkan ke dalam koleksi perpustakaan.
        </p>
      </div>

      {/* Layout: form + side panel */}
      <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
        {/* Left: main form */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <div>
            <label className="text-[13px] font-semibold text-[#374151]">
              Judul Lengkap Buku
            </label>
            <input
              placeholder="Contoh: Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa"
              className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Penulis / Pengarang
              </label>
              <input
                placeholder="Nama penulis"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Penerbit
              </label>
              <input
                placeholder="Nama penerbit"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Tahun Terbit
              </label>
              <input
                placeholder="2024"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                ISBN / ISSN
              </label>
              <input
                placeholder="978-602-06-3317-6"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#374151]">
              Kategori
            </label>
            <div className="relative mt-1.5">
              <select className="w-full appearance-none text-[14px] text-[#585F6C] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30">
                <option>Pilih kategori buku</option>
                <option>Sains &amp; Tek</option>
                <option>Self Improvement</option>
                <option>Bisnis</option>
                <option>Sejarah</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#374151]">
              Sinopsis / Deskripsi Singkat
            </label>
            <textarea
              placeholder="Tuliskan ringkasan isi buku di sini..."
              rows={5}
              className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 resize-none"
            />
          </div>
        </div>

        {/* Right: cover + inventory */}
        <div className="space-y-5">
          {/* Sampul Buku */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827]">Sampul Buku</h2>
            <label className="mt-3.5 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E7EB] rounded-xl h-[220px] cursor-pointer hover:border-[#F5A623]/60 transition-colors">
              <input type="file" accept="image/*" className="hidden" />
              <ImagePlus size={28} className="text-[#9CA3AF]" strokeWidth={1.5} />
              <p className="text-[13px] text-[#585F6C] text-center px-6">
                Tarik gambar ke sini atau klik untuk unggah
              </p>
            </label>
            <p className="text-[12px] text-[#9CA3AF] text-center mt-2">
              Rekomendasi: 800x1200px (JPG/PNG)
            </p>
          </div>

          {/* Inventaris */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2">
              <Archive size={17} className="text-[#B45309]" />
              <h2 className="text-[15px] font-bold text-[#111827]">Inventaris</h2>
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">
                Jumlah Stok
              </label>
              <div className="flex items-center mt-1.5 border border-[#E5E7EB] rounded-lg overflow-hidden">
                <button
                  onClick={() => setStok((s) => Math.max(0, s - 1))}
                  className="px-3.5 py-2.5 text-[#585F6C] hover:bg-[#F9FAFB]"
                >
                  <Minus size={15} />
                </button>
                <input
                  value={stok}
                  onChange={(e) => setStok(Number(e.target.value) || 0)}
                  className="flex-1 text-center text-[14px] font-semibold text-[#111827] outline-none"
                />
                <button
                  onClick={() => setStok((s) => s + 1)}
                  className="px-3.5 py-2.5 text-[#585F6C] hover:bg-[#F9FAFB]"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">
                Kode Rak / Lokasi
              </label>
              <input
                placeholder="Contoh: A1-04"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">
                Kondisi Buku
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(['Baru', 'Baik', 'Rusak'] as Kondisi[]).map((k) => (
                  <button
                    key={k}
                    onClick={() => setKondisi(k)}
                    className={`text-[13px] font-semibold py-2 rounded-lg border transition-colors ${
                      kondisi === k
                        ? 'bg-[#B45309] text-white border-[#B45309]'
                        : 'bg-white text-[#374151] border-[#E5E7EB] hover:bg-[#F9FAFB]'
                    }`}
                  >
                    {k}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
        <Link
          href="/admin/buku"
          className="text-[14px] font-semibold text-[#374151] border border-[#E5E7EB] rounded-xl px-5 py-3 hover:bg-[#F9FAFB]"
        >
          Batal
        </Link>
        <button className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm">
          <Save size={17} />
          Simpan Buku
        </button>
      </div>
    </div>
  );
}