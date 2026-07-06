'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  UserPlus,
  Users,
  BookMarked,
  AlertCircle,
  UserCheck,
  Filter,
  Download,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
} from 'lucide-react';
import { useAnggota } from '@/lib/hooks/useAnggota';
import { deleteAnggota } from '@/lib/data/anggota';

type Status = 'AKTIF' | 'NON-AKTIF';

const avatarColors = ['#93C5FD', '#F9A8D4', '#78350F', '#6EE7B7', '#FCD34D', '#FCA5A5'];

export default function AnggotaPage() {
  const { anggota, loading } = useAnggota();
  const [search, setSearch] = useState('');
  const page = 1;

  // Hitung statistik
  const totalAnggota = anggota.length;
  const anggotaAktif = anggota.filter((a) => a.status === 'AKTIF').length;
  const anggotaMeminjam = anggota.filter((a) => (a.total_pinjaman || 0) > 0).length;
  const registrasiBulanIni = anggota.filter((a) => {
    const now = new Date();
    const daftar = new Date(a.tanggal_daftar);
    return daftar.getMonth() === now.getMonth() && daftar.getFullYear() === now.getFullYear();
  }).length;

  const stats = [
    {
      label: 'Total Anggota',
      value: totalAnggota.toString(),
      valueColor: 'text-[#111827]',
      icon: Users,
      iconBg: 'bg-[#FDECC8]',
      iconColor: 'text-[#B45309]',
    },
    {
      label: 'Aktif Meminjam',
      value: anggotaMeminjam.toString(),
      valueColor: 'text-[#16A34A]',
      icon: BookMarked,
      iconBg: 'bg-[#D1FAE5]',
      iconColor: 'text-[#16A34A]',
    },
    {
      label: 'Terlambat Kembali',
      value: '0', // Nanti kita hitung dari peminjaman
      valueColor: 'text-[#DC2626]',
      icon: AlertCircle,
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      highlighted: true,
    },
    {
      label: 'Registrasi Baru (Bulan Ini)',
      value: registrasiBulanIni.toString(),
      valueColor: 'text-[#2563EB]',
      icon: UserCheck,
      iconBg: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
    },
  ];

  const handleDelete = async (id: string) => {
    if (confirm('Yakin ingin menghapus anggota ini?')) {
      const success = await deleteAnggota(id);
      if (!success) {
        alert('Gagal menghapus anggota. Pastikan anggota tidak memiliki peminjaman aktif.');
      }
    }
  };

  const filteredAnggota = anggota.filter((a) =>
    a.nama.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase()) ||
    a.id.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <div className="p-6 text-[#585F6C]">Loading...</div>;
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Kelola Data Anggota</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Kelola informasi keanggotaan perpustakaan secara efisien.
          </p>
        </div>
        <Link
          href="/admin/anggota/tambah"
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E0951C] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm"
        >
          <UserPlus size={18} strokeWidth={2.5} />
          Tambah Anggota
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className={`bg-white rounded-xl p-5 ${
                stat.highlighted
                  ? 'border-l-4 border-l-[#DC2626] border-y border-r border-[#E5E7EB]'
                  : 'border border-[#E5E7EB]'
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide">
                  {stat.label}
                </p>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${stat.iconBg}`}>
                  <Icon size={17} className={stat.iconColor} strokeWidth={2} />
                </div>
              </div>
              <p className={`text-[26px] font-bold mt-2 ${stat.valueColor}`}>
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Search */}
      <div className="flex items-center gap-3 mt-6">
        <div className="flex-1 relative max-w-sm">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, ID, atau email..."
            className="w-full px-4 py-2.5 text-[14px] text-[#111827] placeholder:text-[#9CA3AF] border border-[#E5E7EB] rounded-xl bg-white outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/30"
          />
        </div>
        <span className="text-[13px] text-[#585F6C]">{filteredAnggota.length} anggota ditemukan</span>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-4 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <h2 className="text-[16px] font-bold text-[#B45309]">Daftar Anggota</h2>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg border border-[#E5E7EB] text-[#585F6C] hover:bg-[#F9FAFB]">
              <Filter size={16} />
            </button>
            <button className="p-2 rounded-lg border border-[#E5E7EB] text-[#585F6C] hover:bg-[#F9FAFB]">
              <Download size={16} />
            </button>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Anggota
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                ID Anggota
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Kontak
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Tgl Registrasi
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Pinjaman
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
            {filteredAnggota.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-[#9CA3AF]">
                  {search ? 'Tidak ada anggota yang sesuai' : 'Belum ada anggota terdaftar'}
                </td>
              </tr>
            ) : (
              filteredAnggota.map((member, i) => {
                const avatarBg = avatarColors[i % avatarColors.length];
                return (
                  <tr
                    key={member.id}
                    className={i !== filteredAnggota.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full shrink-0`} style={{ backgroundColor: avatarBg }} />
                        <div>
                          <p className="text-[14px] font-semibold text-[#B45309]">
                            {member.nama}
                          </p>
                          <p className="text-[13px] text-[#585F6C]">{member.instansi || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#374151]">
                      {member.id.slice(0, 8)}...
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[13.5px] text-[#374151]">{member.email}</p>
                      <p className="text-[13px] text-[#9CA3AF]">{member.telepon || '-'}</p>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-[#585F6C]">
                      {new Date(member.tanggal_daftar).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-semibold text-[#B45309] bg-[#FDECC8] px-2.5 py-1 rounded-md">
                        {member.total_pinjaman || 0} Buku
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${
                          member.status === 'AKTIF'
                            ? 'bg-[#D1FAE5] text-[#16A34A]'
                            : 'bg-[#F3F4F6] text-[#585F6C]'
                        }`}
                      >
                        {member.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/anggota/edit/${member.id}`}
                          className="p-1.5 rounded-md hover:bg-[#F3F4F6] text-[#585F6C]"
                        >
                          <Pencil size={15} />
                        </Link>
                        <button
                          onClick={() => handleDelete(member.id)}
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

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#585F6C]">
            Menampilkan {filteredAnggota.length} dari {totalAnggota} anggota
          </p>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-md border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB]">
              <ChevronLeft size={16} />
            </button>
            <button className="w-8 h-8 rounded-md text-[13px] font-semibold bg-[#B45309] text-white">
              1
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