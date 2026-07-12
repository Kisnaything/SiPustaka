'use client';

import { useState, useEffect, useMemo } from 'react';
import {
  CheckCircle,
  User,
  BookOpen,
  Search,
  Clock,
} from 'lucide-react';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';
import { usePengaturan } from '@/lib/hooks/usePengaturan';
import { selesaikanPeminjaman } from '@/lib/data/peminjaman';
import Pagination from '@/components/Pagination';

const tabs = ['Semua', 'Jatuh Tempo Hari Ini', 'Mendekati Tenggat', 'Selesai'] as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric',
  })
}

export default function PengembalianPage() {
  const allPeminjaman = usePeminjaman();
  const pengaturan = usePengaturan();

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const now = useMemo(() => new Date(), [])
  const todayStr = now.toISOString().split('T')[0]

  const aktifList = useMemo(() =>
    allPeminjaman.filter((p) => p.status === 'Aktif'),
  [allPeminjaman])

  const tujuhHariLalu = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d.toISOString().split('T')[0]
  }, [])

  // ─── Data per tab ──────────────────────────────────────
  const tabData = useMemo(() => {
    const semua = aktifList

    const jatuhTempoHariIni = aktifList.filter((p) =>
      p.jatuh_tempo === todayStr
    )

    const mendekati = aktifList.filter((p) => {
      if (!p.jatuh_tempo) return false
      const diff = Math.ceil((new Date(p.jatuh_tempo).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      return diff >= 1 && diff <= 3
    })

    const selesai = allPeminjaman.filter((p) =>
      p.status === 'Selesai' && p.tanggal_selesai && p.tanggal_selesai >= tujuhHariLalu
    )

    return { semua, jatuhTempoHariIni, mendekati, selesai }
  }, [aktifList, allPeminjaman, todayStr, now, tujuhHariLalu])

  // ─── Search + pagination ──────────────────────────────
  const currentList = useMemo(() => {
    const raw =
      activeTab === 'Semua' ? tabData.semua :
      activeTab === 'Jatuh Tempo Hari Ini' ? tabData.jatuhTempoHariIni :
      activeTab === 'Mendekati Tenggat' ? tabData.mendekati :
      tabData.selesai
    return raw.filter((p) =>
      p.kode_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
      p.anggota_nama.toLowerCase().includes(search.toLowerCase()) ||
      p.buku_judul.toLowerCase().includes(search.toLowerCase())
    )
  }, [activeTab, tabData, search])

  const totalPages = Math.ceil(currentList.length / ITEMS_PER_PAGE)
  const paginatedData = currentList.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => { setCurrentPage(1) }, [search, activeTab])

  // ─── Stats ─────────────────────────────────────────────
  const stats = useMemo(() => ({
    totalTerlambat: aktifList.filter((p) => p.jatuh_tempo && new Date(p.jatuh_tempo) < now).length,
    jatuhTempoHariIni: tabData.jatuhTempoHariIni.length,
    sedangDipinjam: aktifList.length,
    estimasiDenda: aktifList.reduce((sum, p) => {
      if (!p.jatuh_tempo) return sum;
      const t = new Date(p.jatuh_tempo);
      if (now > t) {
        const days = Math.ceil((now.getTime() - t.getTime()) / (1000 * 60 * 60 * 24));
        return sum + days * (pengaturan.denda_per_hari || 2000);
      }
      return sum;
    }, 0),
  }), [aktifList, tabData, pengaturan, now])

  const handleKonfirmasiKembali = async (id: string) => {
    if (!confirm('Yakin buku ini sudah dikembalikan?')) return;
    const result = await selesaikanPeminjaman(id, pengaturan.denda_per_hari);
    const text = result.success && result.denda && result.denda > 0
      ? `${result.message} | Denda: Rp ${result.denda.toLocaleString('id-ID')}`
      : result.message
    setMessage({ type: result.success ? 'success' : 'error', text })
    setTimeout(() => setMessage(null), 5000)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Pengembalian</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Konfirmasi pengembalian buku oleh anggota dan kelola denda otomatis.
          </p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">Total Terlambat</p>
          <p className="text-[26px] font-bold text-[#DC2626] mt-2">{stats.totalTerlambat}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">Jatuh Tempo Hari Ini</p>
          <p className="text-[26px] font-bold text-[#CA8A04] mt-2">{stats.jatuhTempoHariIni}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">Sedang Dipinjam</p>
          <p className="text-[26px] font-bold text-[#111827] mt-2">{stats.sedangDipinjam}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">Estimasi Denda Total</p>
          <p className="text-[26px] font-bold text-[#DC2626] mt-2">Rp {stats.estimasiDenda.toLocaleString('id-ID')}</p>
        </div>
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mt-6 mb-4">
        <div className="flex-1 relative max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode, anggota, atau judul buku..."
            className="w-full pl-9 pr-4 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/30"
          />
        </div>
        <span className="text-[13px] text-[#585F6C] whitespace-nowrap">{currentList.length} data</span>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-[13px] font-medium ${
          message.type === 'success' ? 'bg-[#D1FAE5] text-[#16A34A]' : 'bg-[#FEE2E2] text-[#DC2626]'
        }`}>
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-[#E5E7EB] overflow-x-auto">
        {tabs.map((tab) => {
          const count =
            tab === 'Semua' ? tabData.semua.length :
            tab === 'Jatuh Tempo Hari Ini' ? tabData.jatuhTempoHariIni.length :
            tab === 'Mendekati Tenggat' ? tabData.mendekati.length :
            tabData.selesai.length
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-[14px] font-semibold whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'text-[#B45309] border-b-2 border-[#F5A623]'
                  : 'text-[#585F6C] hover:text-[#111827]'
              }`}
            >
              {tab}
              {count > 0 && (
                <span className={`ml-2 text-[11px] px-2 py-0.5 rounded-full ${
                  tab === 'Selesai' ? 'bg-[#F3F4F6] text-[#6B7280]' : 'bg-[#FEE2E2] text-[#DC2626]'
                }`}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Content */}
      <div className="space-y-4 mt-6">
        {paginatedData.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center">
            <p className="text-[#9CA3AF] text-[15px]">
              {search ? 'Tidak ada data yang sesuai dengan pencarian.' : `Tidak ada peminjaman ${activeTab.toLowerCase()}.`}
            </p>
          </div>
        ) : (
          paginatedData.map((peminjaman) => {
            const isSelesai = activeTab === 'Selesai'
            const isTerlambat = peminjaman.jatuh_tempo && new Date(peminjaman.jatuh_tempo) < now
            const isMendekati = !isSelesai && !isTerlambat && activeTab === 'Mendekati Tenggat'
            const isJatuhTempoHariIni = !isSelesai && peminjaman.jatuh_tempo === todayStr
            const hariTerlambat = isTerlambat
              ? Math.ceil((now.getTime() - new Date(peminjaman.jatuh_tempo!).getTime()) / (1000 * 60 * 60 * 24))
              : 0
            const estimasiDenda = hariTerlambat * (pengaturan.denda_per_hari || 2000)

            let borderColor = 'border-l-[#16A34A]'
            let badgeClass = 'bg-[#DCFCE7] text-[#16A34A]'
            let badgeLabel = 'NORMAL'
            if (isSelesai) {
              borderColor = 'border-l-[#6B7280]'
              badgeClass = 'bg-[#F3F4F6] text-[#6B7280]'
              badgeLabel = 'SELESAI'
            } else if (isTerlambat) {
              borderColor = 'border-l-[#DC2626]'
              badgeClass = 'bg-[#FEE2E2] text-[#DC2626]'
              badgeLabel = 'TERLAMBAT'
            } else if (isMendekati || isJatuhTempoHariIni) {
              borderColor = 'border-l-[#CA8A04]'
              badgeClass = 'bg-[#FDECC8] text-[#B45309]'
              badgeLabel = isJatuhTempoHariIni ? 'HARI INI' : 'MENDEKATI'
            }

            return (
              <div key={peminjaman.id} className={`bg-white rounded-xl border-l-4 ${borderColor} border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Kode + Status */}
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="font-mono text-[14px] font-bold text-[#B45309]">
                        {peminjaman.kode_peminjaman}
                      </span>
                      <span className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${badgeClass}`}>
                        {badgeLabel}
                      </span>
                      {isTerlambat && (
                        <span className="text-[12px] font-medium text-[#DC2626]">{hariTerlambat} hari terlambat</span>
                      )}
                      {(isMendekati || isJatuhTempoHariIni) && peminjaman.jatuh_tempo && (
                        <span className="text-[12px] font-medium text-[#B45309] flex items-center gap-1">
                          <Clock size={13} />
                          {isJatuhTempoHariIni ? 'Jatuh tempo hari ini' : `${Math.ceil((new Date(peminjaman.jatuh_tempo).getTime() - now.getTime()) / (1000 * 60 * 60 * 24))} hari lagi`}
                        </span>
                      )}
                    </div>

                    {/* Anggota + Buku */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-[#585F6C] shrink-0" />
                        <span className="text-[14px] font-medium text-[#111827]">{peminjaman.anggota_nama}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-[#585F6C] shrink-0" />
                        <span className="text-[14px] text-[#374151] truncate">{peminjaman.buku_judul}</span>
                      </div>
                    </div>

                    {/* Tanggal */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[13px] text-[#585F6C]">
                      <span>Pinjam: {peminjaman.tanggal_pinjam ? formatDate(peminjaman.tanggal_pinjam) : '-'}</span>
                      <span className={isTerlambat ? 'font-bold text-[#DC2626]' : 'font-medium'}>
                        Jatuh tempo: {peminjaman.jatuh_tempo ? formatDate(peminjaman.jatuh_tempo) : '-'}
                      </span>
                      {isSelesai && peminjaman.tanggal_selesai && (
                        <span>Selesai: {formatDate(peminjaman.tanggal_selesai)}</span>
                      )}
                      {isTerlambat && (
                        <span className="font-semibold text-[#DC2626]">Denda: Rp {estimasiDenda.toLocaleString('id-ID')}</span>
                      )}
                      {peminjaman.denda > 0 && isSelesai && (
                        <span className="font-semibold text-[#DC2626]">Denda: Rp {peminjaman.denda.toLocaleString('id-ID')}</span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  {!isSelesai && (
                    <div className="shrink-0">
                      <button
                        onClick={() => handleKonfirmasiKembali(peminjaman.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
                      >
                        <CheckCircle size={15} />
                        Konfirmasi Kembali
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={currentList.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}
