'use client';

import { useState } from 'react';
import {
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { usePeminjamanMenunggu, usePeminjamanAktif } from '@/lib/hooks/usePeminjaman';
import { konfirmasiPengambilan, batalkanPeminjaman } from '@/lib/data/peminjaman';

export default function PeminjamanPage() {
  const [kodeInput, setKodeInput] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [activeTab, setActiveTab] = useState<'menunggu' | 'aktif'>('menunggu');

  const menungguList = usePeminjamanMenunggu();
  const aktifList = usePeminjamanAktif();

  const handleKonfirmasi = async (kode: string) => {
    const result = await konfirmasiPengambilan(kode);
    setMessage({
      type: result.success ? 'success' : 'error',
      text: result.message,
    });
    if (result.success) {
      setKodeInput('');
    }
    setTimeout(() => setMessage(null), 5000);
  };

  const handleBatalkan = async (kode: string) => {
    if (confirm('Yakin ingin membatalkan peminjaman ini?')) {
      const result = await batalkanPeminjaman(kode);
      setMessage({
        type: result.success ? 'success' : 'error',
        text: result.message,
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleScan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (kodeInput.trim()) {
      const found = menungguList.find((p) => p.kode_peminjaman === kodeInput.trim());
      if (found) {
        await handleKonfirmasi(kodeInput.trim());
      } else {
        setMessage({
          type: 'error',
          text: 'Kode tidak ditemukan atau sudah dikonfirmasi',
        });
        setTimeout(() => setMessage(null), 5000);
      }
    }
  };

  const currentList = activeTab === 'menunggu' ? menungguList : aktifList;

  const getSisaWaktu = (tanggalReservasi: string) => {
    const reservasi = new Date(tanggalReservasi);
    const now = new Date();
    const diffMs = reservasi.getTime() + 24 * 60 * 60 * 1000 - now.getTime();
    if (diffMs <= 0) return 'Habis';
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}j ${minutes}m`;
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Peminjaman</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Kelola peminjaman buku dan konfirmasi pengambilan oleh anggota.
          </p>
        </div>
      </div>

      {/* Scan Kode */}
      <div className="bg-[#FFF8EE] border border-[#F3E5C8] rounded-xl p-5 mt-6">
        <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2">
          <Search size={18} className="text-[#B45309]" />
          Konfirmasi Peminjaman
        </h2>
        <p className="text-[13px] text-[#585F6C] mt-1">
          Scan atau input kode peminjaman yang diberikan oleh anggota.
        </p>

        <form onSubmit={handleScan} className="flex items-center gap-3 mt-4">
          <input
            value={kodeInput}
            onChange={(e) => setKodeInput(e.target.value)}
            placeholder="Contoh: PMJ-20260705-001"
            className="flex-1 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
          />
          <button
            type="submit"
            className="bg-[#B45309] hover:bg-[#92400E] text-white px-6 py-3 rounded-lg font-semibold text-[14px] transition-colors"
          >
            <CheckCircle size={16} className="inline mr-2" />
            Konfirmasi
          </button>
        </form>

        {message && (
          <div
            className={`mt-3 p-3 rounded-lg text-[13px] font-medium ${
              message.type === 'success'
                ? 'bg-[#D1FAE5] text-[#16A34A]'
                : 'bg-[#FEE2E2] text-[#DC2626]'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] mt-6">
        <button
          onClick={() => setActiveTab('menunggu')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors ${
            activeTab === 'menunggu'
              ? 'text-[#B45309] border-b-2 border-[#B45309]'
              : 'text-[#585F6C] hover:text-[#111827]'
          }`}
        >
          Menunggu Konfirmasi ({menungguList.length})
        </button>
        <button
          onClick={() => setActiveTab('aktif')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors ${
            activeTab === 'aktif'
              ? 'text-[#B45309] border-b-2 border-[#B45309]'
              : 'text-[#585F6C] hover:text-[#111827]'
          }`}
        >
          Aktif ({aktifList.length})
        </button>
      </div>

      {/* List */}
      <div className="space-y-4 mt-6">
        {currentList.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-10 text-center">
            <p className="text-[#9CA3AF] text-[15px]">
              {activeTab === 'menunggu'
                ? 'Tidak ada peminjaman yang menunggu konfirmasi.'
                : 'Tidak ada peminjaman aktif saat ini.'}
            </p>
          </div>
        ) : (
          currentList.map((peminjaman) => {
            const isExpired = getSisaWaktu(peminjaman.tanggal_reservasi) === 'Habis';
            return (
              <div
                key={peminjaman.kode_peminjaman} // ← PASTIKAN PAKAI KODE, BUKAN ID
                className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:border-[#F5A623]/40 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-[14px] font-bold text-[#B45309]">
                        {peminjaman.kode_peminjaman}
                      </span>
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          peminjaman.status === 'Menunggu Konfirmasi'
                            ? 'bg-[#FEF9C3] text-[#854D0E]'
                            : 'bg-[#DCFCE7] text-[#16A34A]'
                        }`}
                      >
                        {peminjaman.status}
                      </span>
                      {peminjaman.status === 'Menunggu Konfirmasi' && (
                        <span className="text-[12px] text-[#9CA3AF]">
                          Sisa waktu: {getSisaWaktu(peminjaman.tanggal_reservasi)}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="flex items-center gap-2">
                        <User size={15} className="text-[#585F6C]" />
                        <span className="text-[14px] font-medium text-[#111827]">
                          {peminjaman.anggota_nama}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen size={15} className="text-[#585F6C]" />
                        <span className="text-[14px] text-[#374151]">
                          {peminjaman.buku_judul}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-[13px] text-[#585F6C]">
                      <span>Reservasi: {new Date(peminjaman.tanggal_reservasi).toLocaleString('id-ID')}</span>
                      {peminjaman.tanggal_pinjam && (
                        <span>Dipinjam: {peminjaman.tanggal_pinjam}</span>
                      )}
                      {peminjaman.jatuh_tempo && (
                        <span className="font-medium text-[#DC2626]">
                          Jatuh tempo: {peminjaman.jatuh_tempo}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    {peminjaman.status === 'Menunggu Konfirmasi' && (
                      <>
                        {isExpired ? (
                          <button
                            onClick={() => handleBatalkan(peminjaman.kode_peminjaman)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#FEE2E2] text-[#DC2626] rounded-lg text-[13px] font-semibold hover:bg-[#FECACA] transition-colors"
                          >
                            <XCircle size={15} />
                            Batalkan (Expired)
                          </button>
                        ) : (
                          <button
                            onClick={() => handleKonfirmasi(peminjaman.kode_peminjaman)}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#B45309] text-white rounded-lg text-[13px] font-semibold hover:bg-[#92400E] transition-colors"
                          >
                            <CheckCircle size={15} />
                            Konfirmasi Ambil
                          </button>
                        )}
                      </>
                    )}
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