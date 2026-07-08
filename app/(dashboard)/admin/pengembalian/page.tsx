'use client';

import { useState } from 'react';
import {
  CheckCircle,
  XCircle,
  User,
  BookOpen,
  Calendar,
  Clock,
  AlertCircle,
  Search,
} from 'lucide-react';
import { usePeminjamanAktif } from '@/lib/hooks/usePeminjaman';
import { selesaikanPeminjaman } from '@/lib/data/peminjaman';

export default function PengembalianPage() {
  const aktifList = usePeminjamanAktif();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );
  const [search, setSearch] = useState('');

  const handleKonfirmasiKembali = async (id: string) => {
    if (!confirm('Yakin buku ini sudah dikembalikan?')) return;

    const result = await selesaikanPeminjaman(id);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });

    if (result.success && result.denda && result.denda > 0) {
      setMessage({
        type: 'success',
        text: `${result.message} | Denda: Rp ${result.denda.toLocaleString('id-ID')}`,
      });
    }

    setTimeout(() => setMessage(null), 5000);
  };

  const filtered = aktifList.filter(
    (p) =>
      p.kode_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
      p.anggota_nama.toLowerCase().includes(search.toLowerCase()) ||
      p.buku_judul.toLowerCase().includes(search.toLowerCase())
  );

  // Hitung statistik
  const totalAktif = aktifList.length;

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
      <div className="grid grid-cols-4 gap-4 mt-6">
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Total Terlambat
          </p>
          <p className="text-[26px] font-bold text-[#DC2626] mt-2">
            {
              aktifList.filter((p) => {
                if (!p.jatuh_tempo) return false;
                return new Date(p.jatuh_tempo) < new Date();
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Jatuh Tempo Hari Ini
          </p>
          <p className="text-[26px] font-bold text-[#CA8A04] mt-2">
            {
              aktifList.filter((p) => {
                if (!p.jatuh_tempo) return false;
                const today = new Date().toISOString().split('T')[0];
                return p.jatuh_tempo === today;
              }).length
            }
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Sedang Dipinjam
          </p>
          <p className="text-[26px] font-bold text-[#111827] mt-2">{totalAktif}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5">
          <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
            Estimasi Denda Total
          </p>
          <p className="text-[26px] font-bold text-[#DC2626] mt-2">
            Rp{' '}
            {aktifList
              .reduce((sum, p) => {
                if (!p.jatuh_tempo) return sum;
                const jatuhTempo = new Date(p.jatuh_tempo);
                const now = new Date();
                if (now > jatuhTempo) {
                  const days = Math.ceil(
                    (now.getTime() - jatuhTempo.getTime()) / (1000 * 60 * 60 * 24)
                  );
                  return sum + days * 2000;
                }
                return sum;
              }, 0)
              .toLocaleString('id-ID')}
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
            placeholder="Cari kode, anggota, atau judul buku..."
            className="w-full pl-9 pr-4 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/30"
          />
        </div>
        <span className="text-[13px] text-[#585F6C]">{filtered.length} peminjaman aktif</span>
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
                ? 'Tidak ada peminjaman aktif yang sesuai dengan pencarian.'
                : 'Tidak ada peminjaman aktif saat ini.'}
            </p>
          </div>
        ) : (
          filtered.map((peminjaman) => {
            const isTerlambat =
              peminjaman.jatuh_tempo && new Date(peminjaman.jatuh_tempo) < new Date();
            const hariTerlambat = isTerlambat
              ? Math.ceil(
                  (new Date().getTime() - new Date(peminjaman.jatuh_tempo!).getTime()) /
                    (1000 * 60 * 60 * 24)
                )
              : 0;
            const estimasiDenda = hariTerlambat * 2000;

            return (
              <div
                key={peminjaman.id}
                className={`bg-white rounded-xl border-l-4 ${
                  isTerlambat ? 'border-l-[#DC2626]' : 'border-l-[#16A34A]'
                } border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    {/* Kode + Status */}
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[14px] font-bold text-[#B45309]">
                        {peminjaman.kode_peminjaman}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          isTerlambat
                            ? 'bg-[#FEE2E2] text-[#DC2626]'
                            : 'bg-[#DCFCE7] text-[#16A34A]'
                        }`}
                      >
                        {isTerlambat ? 'TERLAMBAT' : 'NORMAL'}
                      </span>
                      {isTerlambat && (
                        <span className="text-[12px] font-medium text-[#DC2626]">
                          {hariTerlambat} hari terlambat
                        </span>
                      )}
                    </div>

                    {/* Anggota + Buku */}
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-[#585F6C]" />
                        <span className="text-[14px] font-medium text-[#111827]">
                          {peminjaman.anggota_nama}
                        </span>
                        <span className="text-[12px] text-[#9CA3AF]">
                          ID: {peminjaman.anggota_id}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-[#585F6C]" />
                        <span className="text-[14px] text-[#374151]">
                          {peminjaman.buku_judul}
                        </span>
                      </div>
                    </div>

                    {/* Tanggal */}
                    <div className="flex items-center gap-4 mt-2 text-[13px] text-[#585F6C]">
                      <span>
                        Pinjam:{' '}
                        {peminjaman.tanggal_pinjam
                          ? new Date(peminjaman.tanggal_pinjam).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </span>
                      <span
                        className={isTerlambat ? 'font-bold text-[#DC2626]' : 'font-medium'}
                      >
                        Jatuh tempo:{' '}
                        {peminjaman.jatuh_tempo
                          ? new Date(peminjaman.jatuh_tempo).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '-'}
                      </span>
                      {isTerlambat && (
                        <span className="font-semibold text-[#DC2626]">
                          Estimasi Denda: Rp {estimasiDenda.toLocaleString('id-ID')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center gap-2 ml-4">
                    <button
                      onClick={() => handleKonfirmasiKembali(peminjaman.id)}
                      className="flex items-center gap-1.5 px-4 py-2 bg-[#B45309] hover:bg-[#92400E] text-white rounded-lg text-[13px] font-semibold transition-colors shadow-sm"
                    >
                      <CheckCircle size={15} />
                      Konfirmasi Kembali
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}