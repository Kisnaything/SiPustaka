'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Download,
  Filter,
  Calendar,
  ChevronDown,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';
import Pagination from '@/components/Pagination';

type StatusFilter = 'Semua' | 'Aktif' | 'Selesai' | 'Dibatalkan' | 'Menunggu Konfirmasi';

export default function LaporanPage() {
  const allPeminjaman = usePeminjaman();

  // ─── Filter State ───
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  // ─── Filter Data ───
  const filteredData = useMemo(() => {
    return allPeminjaman.filter((p) => {
      const pinjamDate = p.tanggal_pinjam || p.tanggal_reservasi;
      if (!pinjamDate) return false;

      const date = new Date(pinjamDate);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);

      const matchDate = date >= start && date <= end;
      const matchStatus = statusFilter === 'Semua' || p.status === statusFilter;

      return matchDate && matchStatus;
    });
  }, [allPeminjaman, startDate, endDate, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, statusFilter]);

  // ─── Statistik ───
  const stats = useMemo(() => {
    const total = filteredData.length;
    const selesai = filteredData.filter((p) => p.status === 'Selesai').length;
    const aktif = filteredData.filter((p) => p.status === 'Aktif').length;
    const totalDenda = filteredData.reduce((sum, p) => sum + (p.denda || 0), 0);

    return { total, selesai, aktif, totalDenda };
  }, [filteredData]);

  // ─── Ekspor CSV ───
  const handleExportCSV = () => {
    const headers = ['Kode', 'Anggota', 'Buku', 'Tanggal Pinjam', 'Tanggal Kembali', 'Status', 'Denda'];
    const rows = filteredData.map((p) => [
      p.kode_peminjaman,
      p.anggota_nama,
      p.buku_judul,
      p.tanggal_pinjam || p.tanggal_reservasi.split('T')[0],
      p.status === 'Selesai' ? p.tanggal_pinjam || '-' : '-',
      p.status,
      p.denda ? `Rp ${p.denda.toLocaleString('id-ID')}` : 'Rp 0',
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan_transaksi_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Laporan Transaksi</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Analisis komprehensif aktivitas peminjaman dan pengembalian buku.
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm transition-colors"
        >
          <Download size={18} />
          Ekspor CSV
        </button>
      </div>

      {/* ─── Filter Panel ─── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mt-6">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <Calendar size={16} className="text-[#585F6C]" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
            />
            <span className="text-[#585F6C]">s/d</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
            />
          </div>

          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="appearance-none text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-4 py-2 pr-8 outline-none focus:ring-2 focus:ring-[#F5A623]/30 bg-white"
            >
              <option value="Semua">Semua Status</option>
              <option value="Aktif">Aktif</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
              <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
          </div>

          <button className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E0951C] text-white text-[14px] font-semibold px-4 py-2 rounded-lg transition-colors">
            <Filter size={16} />
            Terapkan Filter
          </button>
        </div>
      </div>

      {/* ─── Stat Cards ─── */}
      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
                Total Peminjaman
              </p>
              <p className="text-[26px] font-bold text-[#111827] mt-2">{stats.total}</p>
              <p className="text-[12px] text-[#585F6C] mt-1">
                {stats.aktif} masih dipinjam
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FEF3DC] flex items-center justify-center">
              <BookOpen size={18} className="text-[#B45309]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
                Total Pengembalian
              </p>
              <p className="text-[26px] font-bold text-[#111827] mt-2">{stats.selesai}</p>
              <p className="text-[12px] text-[#585F6C] mt-1">
                {stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0}% tingkat pengembalian
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#DCFCE7] flex items-center justify-center">
              <CheckCircle size={18} className="text-[#16A34A]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
                Total Denda
              </p>
              <p className="text-[26px] font-bold text-[#DC2626] mt-2">
                Rp {stats.totalDenda.toLocaleString('id-ID')}
              </p>
              <p className="text-[12px] text-[#585F6C] mt-1">
                {filteredData.filter((p) => p.status_denda === 'Belum Lunas').length} belum bayar
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#FEE2E2] flex items-center justify-center">
              <AlertCircle size={18} className="text-[#DC2626]" />
            </div>
          </div>
        </div>
      </div>

      {/* ─── Tabel Transaksi ─── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
              <tr>
                {['Kode Transaksi', 'Anggota', 'Buku', 'Tgl Pinjam', 'Tgl Kembali', 'Status', 'Denda'].map((h) => (
                  <th
                    key={h}
                    className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3 whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#9CA3AF]">
                    Tidak ada transaksi pada periode yang dipilih.
                  </td>
                </tr>
              ) : (
                paginatedData.map((p, i) => {
                  const statusColor = {
                    'Aktif': 'bg-[#DCFCE7] text-[#16A34A]',
                    'Selesai': 'bg-[#F3F4F6] text-[#6B7280]',
                    'Menunggu Konfirmasi': 'bg-[#FEF9C3] text-[#854D0E]',
                    'Dibatalkan': 'bg-[#FEE2E2] text-[#DC2626]',
                  }[p.status] || 'bg-[#F3F4F6] text-[#6B7280]';

                  return (
                    <tr key={p.id} className={i % 2 === 0 ? 'bg-white' : 'bg-[#FAFAFA]'}>
                      <td className="px-6 py-4 text-[13px] font-medium text-[#B45309] font-mono">
                        {p.kode_peminjaman}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#111827]">{p.anggota_nama}</td>
                      <td className="px-6 py-4 text-[14px] text-[#585F6C]">{p.buku_judul}</td>
                      <td className="px-6 py-4 text-[14px] text-[#585F6C]">
                        {p.tanggal_pinjam
                          ? new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-[14px] text-[#585F6C]">
                        {p.status === 'Selesai'
                          ? p.tanggal_pinjam
                            ? new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })
                            : '-'
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[11px] font-semibold uppercase tracking-wide px-2.5 py-1 rounded-full ${statusColor}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[14px] font-semibold text-[#DC2626]">
                        {p.denda ? `Rp ${p.denda.toLocaleString('id-ID')}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredData.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ─── Grafik Tren ─── */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 mt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[16px] font-bold text-[#111827]">Tren Transaksi Mingguan</h3>
          <span className="text-[12px] text-[#585F6C]">
            {startDate} — {endDate}
          </span>
        </div>

        {filteredData.length === 0 ? (
          <div className="text-center py-8 text-[#9CA3AF]">Tidak ada data untuk ditampilkan</div>
        ) : (
          <div className="flex items-end gap-3 h-[120px]">
            {(() => {
              // Hitung transaksi per hari
              const dailyCounts: Record<string, number> = {};
              filteredData.forEach((p) => {
                const date = (p.tanggal_pinjam || p.tanggal_reservasi).split('T')[0];
                dailyCounts[date] = (dailyCounts[date] || 0) + 1;
              });

              const sortedDates = Object.keys(dailyCounts).sort();
              const maxCount = Math.max(...Object.values(dailyCounts), 1);
              const displayDates = sortedDates.slice(-7); // 7 hari terakhir

              return displayDates.map((date) => {
                const count = dailyCounts[date] || 0;
                const height = (count / maxCount) * 100;
                return (
                  <div key={date} className="flex flex-col items-center flex-1">
                    <div
                      className="w-full max-w-[36px] rounded-t-md bg-[#F5A623]/80 hover:bg-[#F5A623] transition-colors"
                      style={{ height: `${Math.max(height, 4)}%` }}
                    />
                    <span className="text-[10px] text-[#585F6C] mt-1">
                      {new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
                    </span>
                  </div>
                );
              });
            })()}
          </div>
        )}
      </div>
    </div>
  );
}