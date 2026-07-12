'use client';

import { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  Search,
  Eye,
  FileText,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';
import { verifikasiDenda } from '@/lib/data/peminjaman';
import Pagination from '@/components/Pagination';

const statusDendaTabs = ['Semua', 'Menunggu Verifikasi', 'Lunas', 'Ditolak'] as const;
type TabStatus = (typeof statusDendaTabs)[number];

export default function VerifikasiPage() {
  const allPeminjaman = usePeminjaman();

  const [search, setSearch] = useState('');
  const [statusTab, setStatusTab] = useState<TabStatus>('Menunggu Verifikasi');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [alasan, setAlasan] = useState('');
  const [actionType, setActionType] = useState<'tolak' | 'setujui' | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const semuaDenda = allPeminjaman.filter(
    (p) => p.status === 'Selesai' && p.denda > 0
  );

  const filtered = semuaDenda.filter((p) => {
    const matchSearch =
      p.anggota_nama.toLowerCase().includes(search.toLowerCase()) ||
      p.buku_judul.toLowerCase().includes(search.toLowerCase()) ||
      p.kode_peminjaman.toLowerCase().includes(search.toLowerCase());
    const matchTab = statusTab === 'Semua' || p.status_denda === statusTab;
    return matchSearch && matchTab;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusTab]);

  const handleOpenModal = (id: string, action: 'tolak' | 'setujui') => {
    setSelectedId(id);
    setActionType(action);
    if (action === 'tolak') {
      setAlasan('');
      setModalOpen(true);
    } else {
      handleVerifikasi(id, 'Lunas');
    }
  };

  const handleVerifikasi = async (id: string, status: 'Lunas' | 'Ditolak', pesan?: string) => {
    const result = await verifikasiDenda(id, status, pesan);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    setModalOpen(false);
    setSelectedId(null);
    setActionType(null);
    setAlasan('');
    setTimeout(() => setMessage(null), 5000);
  };

  const handleSubmitTolak = () => {
    if (!selectedId) return;
    if (!alasan.trim()) {
      alert('Alasan penolakan harus diisi');
      return;
    }
    handleVerifikasi(selectedId, 'Ditolak', alasan);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Verifikasi Pembayaran</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Verifikasi bukti pembayaran denda keterlambatan pengembalian buku.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Total Menunggu
          </p>
          <p className="text-[26px] font-bold text-[#CA8A04] mt-2">
            {semuaDenda.filter((p) => p.status_denda === 'Menunggu Verifikasi').length}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Total Denda Diverifikasi
          </p>
          <p className="text-[26px] font-bold text-[#16A34A] mt-2">
            {semuaDenda.filter((p) => p.status_denda === 'Lunas').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Total Ditolak
          </p>
          <p className="text-[26px] font-bold text-[#DC2626] mt-2">
            {semuaDenda.filter((p) => p.status_denda === 'Ditolak').length || 0}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Total Denda
          </p>
          <p className="text-[26px] font-bold text-[#111827] mt-2">
            {semuaDenda.length}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari anggota, buku, atau kode..."
            className="w-full pl-9 pr-4 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/30"
          />
        </div>
        <span className="text-[13px] text-[#585F6C]">{filtered.length} data</span>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-1 mt-4 border-b border-[#E5E7EB]">
        {statusDendaTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setStatusTab(tab)}
            className={`pb-3 px-4 text-[13px] font-semibold transition-colors ${
              statusTab === tab
                ? 'text-[#B45309] border-b-2 border-[#B45309]'
                : 'text-[#585F6C] hover:text-[#111827]'
            }`}
          >
            {tab === 'Menunggu Verifikasi' ? 'Menunggu' : tab}
          </button>
        ))}
      </div>

      {/* Message */}
      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-[13px] font-medium ${
            message.type === 'success'
              ? 'bg-[#D1FAE5] text-[#16A34A]'
              : 'bg-[#FEE2E2] text-[#DC2626]'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* List */}
      <div className="space-y-4 mt-6">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center">
            <p className="text-[#9CA3AF] text-[15px]">
                  {search
                    ? 'Tidak ada data yang sesuai dengan pencarian.'
                    : `Tidak ada denda dengan status "${statusTab === 'Menunggu Verifikasi' ? 'Menunggu' : statusTab}".`}
            </p>
          </div>
        ) : (
          paginatedData.map((peminjaman) => {
            const totalDenda = peminjaman.denda || 0;
            return (
              <div
                key={peminjaman.id}
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                  <div className="flex-1">
                    {/* Anggota */}
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#FEF3DC] flex items-center justify-center text-[#B45309] font-bold text-sm">
                        {peminjaman.anggota_nama.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[14px] font-semibold text-[#111827]">
                          {peminjaman.anggota_nama}
                        </p>
                        <p className="text-[12px] text-[#9CA3AF]">
                          ID: {peminjaman.anggota_id} · Mahasiswa
                        </p>
                      </div>
                      <span className="ml-auto text-[12px] text-[#9CA3AF]">
                        Diajukan:{' '}
                        {new Date(peminjaman.tanggal_reservasi).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>

                    {/* Detail Buku & Denda */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-3 bg-[#F9FAFB] rounded-lg p-3">
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-[#585F6C]" />
                        <span className="text-[14px] font-medium text-[#111827]">
                          {peminjaman.buku_judul}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={15} className="text-[#585F6C]" />
                        <span className="text-[13px] text-[#374151]">
                          Pinjam:{' '}
                          {peminjaman.tanggal_pinjam
                            ? new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}{' '}
                          → Jatuh tempo:{' '}
                          {peminjaman.jatuh_tempo
                            ? new Date(peminjaman.jatuh_tempo).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={15} className="text-[#DC2626]" />
                        <span className="text-[13px] text-[#DC2626] font-semibold">
                          Terlambat {peminjaman.hari_terlambat || 0} hari
                        </span>
                      </div>
                    </div>

                    {/* Total Denda */}
                    <div className="mt-3 flex flex-wrap items-center gap-3">
                      <span className="text-[13px] font-medium text-[#585F6C]">Total Tagihan:</span>
                      <span className="text-[18px] font-bold text-[#DC2626]">
                        Rp {totalDenda.toLocaleString('id-ID')}
                      </span>
                      {peminjaman.bukti_bayar && (
                        <a
                          href={peminjaman.bukti_bayar}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <img src={peminjaman.bukti_bayar} alt="Bukti Pembayaran"
                            className="h-20 rounded-lg border border-[#E5E7EB] hover:opacity-80 transition-opacity"
                          />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Aksi / Status */}
                  <div className="flex items-start gap-2 ml-4 shrink-0">
                    {peminjaman.status_denda === 'Menunggu Verifikasi' ? (
                      <>
                        <button
                          onClick={() => handleOpenModal(peminjaman.id, 'tolak')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] rounded-lg text-[13px] font-semibold transition-colors whitespace-nowrap"
                        >
                          <XCircle size={15} />
                          Tolak
                        </button>
                        <button
                          onClick={() => handleOpenModal(peminjaman.id, 'setujui')}
                          className="flex items-center gap-1.5 px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm whitespace-nowrap"
                        >
                          <CheckCircle size={15} />
                          Setujui
                        </button>
                      </>
                    ) : (
                      <span className={`text-[12px] font-semibold px-3 py-1.5 rounded-full whitespace-nowrap ${
                        peminjaman.status_denda === 'Lunas'
                          ? 'bg-[#DCFCE7] text-[#16A34A]'
                          : peminjaman.status_denda === 'Ditolak'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#F3F4F6] text-[#6B7280]'
                      }`}>
                        {peminjaman.status_denda || 'Belum Lunas'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filtered.length}
        onPageChange={setCurrentPage}
      />

      {/* ─── Modal Tolak ─── */}
      {modalOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">Tolak Pembayaran</h2>
                <p className="text-[13px] text-[#585F6C] mt-1">
                  Berikan alasan penolakan agar anggota dapat mengunggah ulang.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 hover:bg-[#F3F4F6] rounded-lg"
              >
                <XCircle size={20} className="text-[#9CA3AF]" />
              </button>
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: Bukti transfer tidak terbaca, nominal tidak sesuai..."
                rows={4}
                className="w-full mt-1.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 text-[13px] font-semibold text-[#585F6C] hover:bg-[#F3F4F6] rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSubmitTolak}
                className="px-4 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
              >
                <XCircle size={15} className="inline mr-1.5" />
                Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}