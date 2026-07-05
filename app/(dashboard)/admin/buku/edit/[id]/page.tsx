'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import {
  ImagePlus,
  Archive,
  Minus,
  Plus,
  Save,
  ChevronDown,
  BookOpen,
  X,
  FileText,
  Eye,
} from 'lucide-react';
import { useBukuById } from '@/lib/hooks/useBuku';
import { updateBook } from '@/lib/data/buku';

type Kondisi = 'Baru' | 'Baik' | 'Rusak';

export default function EditBukuPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const book = useBukuById(id);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewInputRef = useRef<HTMLInputElement>(null);

  const [stok, setStok] = useState(0);
  const [kondisi, setKondisi] = useState<Kondisi>('Baik');
  const [judul, setJudul] = useState('');
  const [penulis, setPenulis] = useState('');
  const [penerbit, setPenerbit] = useState('');
  const [tahun, setTahun] = useState('');
  const [isbn, setIsbn] = useState('');
  const [kategori, setKategori] = useState('');
  const [sinopsis, setSinopsis] = useState('');
  const [kodeRak, setKodeRak] = useState('');

  // State cover
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [coverBase64, setCoverBase64] = useState<string | null>(null);
  const [coverChanged, setCoverChanged] = useState(false);

  // State preview PDF
  const [previewBase64, setPreviewBase64] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string | null>(null);
  const [previewChanged, setPreviewChanged] = useState(false);
  const [hasExistingPreview, setHasExistingPreview] = useState(false);

  useEffect(() => {
    if (book) {
      setJudul(book.judul);
      setPenulis(book.penulis);
      setPenerbit(book.penerbit || '');
      setTahun(String(book.tahun));
      setIsbn(book.isbn);
      setKategori(book.kategori);
      setSinopsis(book.sinopsis);
      setStok(book.stok);
      if (book.cover) {
        setCoverPreview(book.cover);
        setCoverBase64(book.cover);
      }
      if (book.preview) {
        setPreviewBase64(book.preview);
        setHasExistingPreview(true);
        setPreviewName('Preview.pdf');
      }
    }
  }, [book]);

  // ─── Cover Handlers ───
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Hanya file gambar (JPG, PNG) yang diperbolehkan');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setCoverPreview(result);
      setCoverBase64(result);
      setCoverChanged(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCover = () => {
    setCoverPreview(null);
    setCoverBase64(null);
    setCoverChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ─── Preview Handlers ───
  const handlePreviewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      alert('Hanya file PDF yang diperbolehkan');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewBase64(result);
      setPreviewName(file.name);
      setPreviewChanged(true);
      setHasExistingPreview(true);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePreview = () => {
    setPreviewBase64(null);
    setPreviewName(null);
    setPreviewChanged(true);
    setHasExistingPreview(false);
    if (previewInputRef.current) {
      previewInputRef.current.value = '';
    }
  };

  if (!book) {
    return <div className="p-6">Buku tidak ditemukan</div>;
  }

  const handleSubmit = () => {
    if (!judul || !penulis || !kategori) {
      alert('Harap lengkapi field yang wajib (judul, penulis, kategori)');
      return;
    }

    const updatedData: any = {
      judul,
      penulis,
      kategori,
      penerbit: penerbit || 'Unknown',
      tahun: parseInt(tahun) || new Date().getFullYear(),
      isbn: isbn || '000-000-000-0',
      stok,
      sinopsis: sinopsis || 'Tidak ada sinopsis',
    };

    if (coverChanged) {
      updatedData.cover = coverBase64;
    }

    if (previewChanged) {
      updatedData.preview = previewBase64;
    }

    updateBook(id, updatedData);
    router.push('/admin/buku');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-[14px] text-[#9CA3AF] flex items-center gap-2">
        <Link href="/admin/buku" className="hover:text-[#585F6C]">
          Kelola Data Buku
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-[#B45309]">Edit Buku</span>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-[24px] font-bold text-[#111827]">Edit Data Buku</h1>
        <p className="text-[14px] text-[#585F6C] mt-1">
          Perbarui detail buku{' '}
          <span className="font-semibold text-[#374151]">"{book.judul}"</span> (ID: {id}).
        </p>
      </div>

      {/* Layout: 2 columns */}
      <div className="grid grid-cols-[1fr_340px] gap-6 mt-6">
        {/* ─── LEFT: Main Form ─── */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 space-y-5">
          <div>
            <label className="text-[13px] font-semibold text-[#374151]">
              Judul Lengkap Buku <span className="text-red-500">*</span>
            </label>
            <input
              value={judul}
              onChange={(e) => setJudul(e.target.value)}
              className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Penulis / Pengarang <span className="text-red-500">*</span>
              </label>
              <input
                value={penulis}
                onChange={(e) => setPenulis(e.target.value)}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">Penerbit</label>
              <input
                value={penerbit}
                onChange={(e) => setPenerbit(e.target.value)}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Tahun Terbit
              </label>
              <input
                value={tahun}
                onChange={(e) => setTahun(e.target.value)}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                ISBN / ISSN
              </label>
              <input
                value={isbn}
                onChange={(e) => setIsbn(e.target.value)}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold text-[#374151]">
              Kategori <span className="text-red-500">*</span>
            </label>
            <div className="relative mt-1.5">
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
                className="w-full appearance-none text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              >
                <option value="">Pilih kategori</option>
                <option value="Sains & Tek">Sains &amp; Tek</option>
                <option value="Self Improvement">Self Improvement</option>
                <option value="Bisnis">Bisnis</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Sastra Indonesia">Sastra Indonesia</option>
                <option value="Puisi">Puisi</option>
                <option value="Fiksi Ilmiah">Fiksi Ilmiah</option>
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
              value={sinopsis}
              onChange={(e) => setSinopsis(e.target.value)}
              rows={4}
              className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 resize-none"
            />
          </div>
        </div>

        {/* ─── RIGHT: Cover + Preview + Inventory ─── */}
        <div className="space-y-5">
          {/* Sampul Buku */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
              <ImagePlus size={18} className="text-[#B45309]" />
              Sampul Buku
            </h2>
            <div className="mt-3.5 relative">
              {coverPreview ? (
                <div className="relative">
                  <img
                    src={coverPreview}
                    alt="Cover preview"
                    className="w-full h-[200px] object-cover rounded-xl border border-[#E5E7EB]"
                  />
                  <button
                    onClick={handleRemoveCover}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                  >
                    <X size={16} className="text-[#585F6C]" />
                  </button>
                </div>
              ) : (
                <label
                  htmlFor="cover-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E7EB] rounded-xl h-[200px] cursor-pointer hover:border-[#F5A623]/60 transition-colors"
                >
                  <ImagePlus size={28} className="text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="text-[13px] text-[#585F6C] text-center px-6">
                    Klik untuk unggah cover
                  </p>
                </label>
              )}
              <input
                ref={fileInputRef}
                id="cover-upload"
                type="file"
                accept="image/*"
                onChange={handleCoverChange}
                className="hidden"
              />
            </div>
          </div>

          {/* ─── PREVIEW PDF ─── */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
              <FileText size={18} className="text-[#B45309]" />
              Preview Buku (PDF)
            </h2>
            <p className="text-[12px] text-[#9CA3AF] mt-1">
              Upload 6-7 halaman pertama buku dalam format PDF
            </p>

            <div className="mt-3.5">
              {previewBase64 ? (
                <div className="flex items-center gap-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg p-3">
                  <FileText size={24} className="text-[#B45309]" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#111827] truncate">
                      {previewName || 'Preview.pdf'}
                    </p>
                    <p className="text-[11px] text-[#9CA3AF]">
                      {hasExistingPreview && !previewChanged ? 'Preview tersimpan' : 'PDF siap diunggah'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => window.open(previewBase64, '_blank')}
                      className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#585F6C]"
                      title="Lihat preview"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={handleRemovePreview}
                      className="p-1.5 rounded-md hover:bg-[#FEE2E2] text-[#DC2626]"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="preview-upload"
                  className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-[#E5E7EB] rounded-xl h-[100px] cursor-pointer hover:border-[#F5A623]/60 transition-colors"
                >
                  <FileText size={24} className="text-[#9CA3AF]" strokeWidth={1.5} />
                  <p className="text-[13px] text-[#585F6C] text-center px-6">
                    Klik untuk unggah PDF preview
                  </p>
                  <p className="text-[11px] text-[#9CA3AF]">Maks. 5MB</p>
                </label>
              )}
              <input
                ref={previewInputRef}
                id="preview-upload"
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePreviewChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Inventaris */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2">
              <Archive size={17} className="text-[#B45309]" />
              <h2 className="text-[15px] font-bold text-[#111827]">Inventaris</h2>
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">Jumlah Stok</label>
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
                value={kodeRak}
                onChange={(e) => setKodeRak(e.target.value)}
                placeholder="Contoh: A1-04"
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">Kondisi Buku</label>
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

      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
        <Link
          href="/admin/buku"
          className="text-[14px] font-semibold text-[#374151] border border-[#E5E7EB] rounded-xl px-5 py-3 hover:bg-[#F9FAFB]"
        >
          Batal
        </Link>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm"
        >
          <Save size={17} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}