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

type Status = 'AKTIF' | 'NON-AKTIF';

const stats = [
  {
    label: 'Total Anggota',
    value: '2,450',
    valueColor: 'text-[#111827]',
    icon: Users,
    iconBg: 'bg-[#FDECC8]',
    iconColor: 'text-[#B45309]',
  },
  {
    label: 'Aktif Meminjam',
    value: '842',
    valueColor: 'text-[#16A34A]',
    icon: BookMarked,
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#16A34A]',
  },
  {
    label: 'Terlambat Kembali',
    value: '12',
    valueColor: 'text-[#DC2626]',
    icon: AlertCircle,
    iconBg: 'bg-[#FEE2E2]',
    iconColor: 'text-[#DC2626]',
    highlighted: true,
  },
  {
    label: 'Registrasi Baru (Bulan Ini)',
    value: '156',
    valueColor: 'text-[#2563EB]',
    icon: UserCheck,
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
  },
];

const members = [
  {
    id: 1,
    name: 'Budi Raharjo',
    faculty: 'Teknik Informatika',
    memberId: 'LIB-2023-001',
    email: 'budi.ra@univ.ac.id',
    phone: '+62 812-3456-7890',
    tglRegistrasi: '12 Jan 2023',
    pinjaman: '3 Buku',
    status: 'AKTIF' as Status,
    avatar: 'bg-[#93C5FD]',
  },
  {
    id: 2,
    name: 'Siti Aminah',
    faculty: 'Sains Lingkungan',
    memberId: 'LIB-2023-045',
    email: 'siti.am@univ.ac.id',
    phone: '+62 856-7890-1234',
    tglRegistrasi: '24 Feb 2023',
    pinjaman: '0 Buku',
    status: 'AKTIF' as Status,
    avatar: 'bg-[#F9A8D4]',
  },
  {
    id: 3,
    name: 'Prof. Dr. Hendra',
    faculty: 'Fakultas Ekonomi',
    memberId: 'LIB-2022-112',
    email: 'hendra.eco@univ.ac.id',
    phone: '+62 811-2233-4455',
    tglRegistrasi: '15 Nov 2022',
    pinjaman: '5 Buku',
    status: 'NON-AKTIF' as Status,
    avatar: 'bg-[#78350F]',
  },
];

export default function AnggotaPage() {
  const page = 1;

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

      {/* Table card */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-6 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5">
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
            {members.map((member, i) => (
              <tr
                key={member.id}
                className={i !== members.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full shrink-0 ${member.avatar}`} />
                    <div>
                      <p className="text-[14px] font-semibold text-[#B45309]">
                        {member.name}
                      </p>
                      <p className="text-[13px] text-[#585F6C]">{member.faculty}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#374151]">{member.memberId}</td>
                <td className="px-6 py-4">
                  <p className="text-[13.5px] text-[#374151]">{member.email}</p>
                  <p className="text-[13px] text-[#9CA3AF]">{member.phone}</p>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#585F6C]">
                  {member.tglRegistrasi}
                </td>
                <td className="px-6 py-4">
                  <span className="text-[12px] font-semibold text-[#B45309] bg-[#FDECC8] px-2.5 py-1 rounded-md">
                    {member.pinjaman}
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
                    <button className="p-1.5 rounded-md hover:bg-[#FEE2E2] text-[#DC2626]">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex items-center justify-between px-6 py-4 border-t border-[#E5E7EB]">
          <p className="text-[13px] text-[#585F6C]">
            Menampilkan 1-3 dari 2,450 anggota
          </p>
          <div className="flex items-center gap-1.5">
            <button className="p-1.5 rounded-md border border-[#E5E7EB] text-[#9CA3AF] hover:bg-[#F9FAFB]">
              <ChevronLeft size={16} />
            </button>
            {[1, 2, 3].map((p) => (
              <button
                key={p}
                className={`w-8 h-8 rounded-md text-[13px] font-semibold ${
                  p === page
                    ? 'bg-[#B45309] text-white'
                    : 'text-[#585F6C] hover:bg-[#F9FAFB]'
                }`}
              >
                {p}
              </button>
            ))}
            <span className="text-[#9CA3AF] px-1">...</span>
            <button className="w-8 h-8 rounded-md text-[13px] font-semibold text-[#585F6C] hover:bg-[#F9FAFB]">
              817
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