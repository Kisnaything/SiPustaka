'use client';

import { useState } from 'react';
import {
  BookOpen,
  Users,
  RefreshCw,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Plus,
  ChevronDown,
  CornerUpLeft,
  Upload,
  LogIn,
  AlertCircle,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Buku',
    value: '1,248',
    trend: '+12%',
    trendUp: true,
    icon: BookOpen,
    iconBg: 'bg-[#FDECC8]',
    iconColor: 'text-[#B45309]',
    barColor: 'bg-[#F5A623]',
  },
  {
    label: 'Anggota Aktif',
    value: '384',
    trend: '+24',
    trendUp: true,
    icon: Users,
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
    barColor: 'bg-[#3B82F6]',
  },
  {
    label: 'Peminjaman Aktif',
    value: '57',
    trend: '-5%',
    trendUp: false,
    icon: RefreshCw,
    iconBg: 'bg-[#FDECC8]',
    iconColor: 'text-[#B45309]',
    barColor: 'bg-[#F5A623]',
  },
  {
    label: 'Denda Belum Lunas',
    value: '14',
    trend: 'Penting',
    trendUp: false,
    urgent: true,
    icon: CreditCard,
    iconBg: 'bg-[#FEE2E2]',
    iconColor: 'text-[#DC2626]',
    barColor: 'bg-[#EF4444]',
  },
];

const activities = [
  {
    icon: CornerUpLeft,
    iconBg: 'bg-[#D1FAE5]',
    iconColor: 'text-[#059669]',
    title: 'Budi Santoso mengembalikan buku "Clean Code"',
    time: 'Baru saja',
  },
  {
    icon: Upload,
    iconBg: 'bg-[#FDECC8]',
    iconColor: 'text-[#B45309]',
    title: 'Buku baru "Atomic Habits" telah diunggah',
    time: '2 jam yang lalu',
  },
  {
    icon: LogIn,
    iconBg: 'bg-[#DBEAFE]',
    iconColor: 'text-[#2563EB]',
    title: 'Siti Aminah meminjam "Psikologi Komunikasi"',
    time: '4 jam yang lalu',
  },
  {
    icon: AlertCircle,
    iconBg: 'bg-[#FEE2E2]',
    iconColor: 'text-[#DC2626]',
    title: 'Denda keterlambatan tercatat untuk Andi Wijaya',
    time: '5 jam yang lalu',
  },
];

const dueSoon = [
  {
    initials: 'RA',
    name: 'Rizky Ardiansyah',
    book: 'Manajemen Proyek Perangkat Lunak',
    date: '12 Okt 2023',
    sisaHari: '1 Hari',
    status: 'KRITIS',
    statusColor: 'bg-[#FEE2E2] text-[#DC2626]',
    sisaColor: 'text-[#DC2626]',
  },
  {
    initials: 'DF',
    name: 'Dewi Fitriani',
    book: 'Sistem Basis Data Terdistribusi',
    date: '15 Okt 2023',
    sisaHari: '2 Hari',
    status: 'MENDEKATI',
    statusColor: 'bg-[#FDECC8] text-[#B45309]',
    sisaColor: 'text-[#B45309]',
  },
  {
    initials: 'BP',
    name: 'Bagus Pratama',
    book: 'Filosofi Teras',
    date: '18 Okt 2023',
    sisaHari: '5 Hari',
    status: 'AMAN',
    statusColor: 'bg-[#F3F4F6] text-[#585F6C]',
    sisaColor: 'text-[#111827]',
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu'];
const chartData = [42, 58, 90, 65, 48, 70, 55, 38];

export default function DashboardPage() {
  const [year, setYear] = useState('Tahun 2023');
  const maxValue = Math.max(...chartData);

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#111827]">
            Selamat Datang Kembali, Admin!
          </h1>
          <p className="text-[14px] font-medium text-[#585F6C] mt-1">
            Berikut adalah ringkasan performa perpustakaan SiPustaka hari ini.
          </p>
        </div>
        <button className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm">
          <Plus size={18} strokeWidth={2.5} />
          Tambah Buku Baru
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          return (
            <div
              key={stat.label}
              className={`relative bg-white rounded-xl border border-[#E5E7EB] p-5 overflow-hidden`}
            >
              <span
                className={`absolute left-0 top-0 bottom-0 w-1 ${stat.barColor}`}
              />
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.iconBg}`}>
                  <Icon size={20} className={stat.iconColor} strokeWidth={2} />
                </div>
                <span
                  className={`flex items-center gap-1 text-[13px] font-semibold ${
                    stat.urgent
                      ? 'text-[#DC2626]'
                      : stat.trendUp
                      ? 'text-[#059669]'
                      : 'text-[#DC2626]'
                  }`}
                >
                  {stat.urgent ? (
                    <AlertCircle size={14} strokeWidth={2.5} />
                  ) : (
                    <TrendIcon size={14} strokeWidth={2.5} />
                  )}
                  {stat.trend}
                </span>
              </div>
              <p className="text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide mt-4">
                {stat.label}
              </p>
              <p className="text-[28px] font-bold text-[#111827] mt-1">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-[1fr_360px] gap-4 mt-6">
        {/* Chart card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[16px] font-bold text-[#111827]">
              Peminjaman per Bulan
            </h2>
            <div className="relative">
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="appearance-none text-[13px] font-medium text-[#111827] border border-[#E5E7EB] rounded-lg pl-3 pr-8 py-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              >
                <option>Tahun 2023</option>
                <option>Tahun 2024</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#585F6C] pointer-events-none"
              />
            </div>
          </div>

          {/* Bars */}
          <div className="flex items-end justify-between gap-3 h-[280px] mt-6 px-1">
            {months.map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div
                  className="w-full max-w-[36px] rounded-t-md bg-[#F5A623]/80 hover:bg-[#F5A623] transition-colors"
                  style={{ height: `${(chartData[i] / maxValue) * 100}%` }}
                />
                <span
                  className={`text-[12px] font-medium ${
                    month === 'Mar' ? 'text-[#B45309] font-semibold' : 'text-[#585F6C]'
                  }`}
                >
                  {month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-[16px] font-bold text-[#111827]">Aktivitas Terbaru</h2>
          <div className="mt-5 relative">
            {activities.map((activity, i) => {
              const Icon = activity.icon;
              const isLast = i === activities.length - 1;
              return (
                <div key={i} className="flex gap-3 relative">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.iconBg}`}
                    >
                      <Icon size={15} className={activity.iconColor} strokeWidth={2} />
                    </div>
                    {!isLast && <div className="w-px flex-1 bg-[#E5E7EB] my-1" />}
                  </div>
                  <div className={`pb-5 ${isLast ? 'pb-0' : ''}`}>
                    <p className="text-[13.5px] font-semibold text-[#111827] leading-snug">
                      {activity.title}
                    </p>
                    <p className="text-[12px] text-[#9CA3AF] mt-0.5">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Due soon table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-6">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[16px] font-bold text-[#111827]">
            Peminjaman Akan Jatuh Tempo
          </h2>
          <button className="text-[13px] font-semibold text-[#B45309] hover:underline">
            Lihat Semua
          </button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="bg-[#F9FAFB] border-y border-[#E5E7EB]">
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Anggota
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Judul Buku
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Tgl Pinjam
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Sisa Hari
              </th>
              <th className="text-left text-[11px] font-semibold text-[#585F6C] uppercase tracking-wide px-6 py-3">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {dueSoon.map((row, i) => (
              <tr
                key={row.name}
                className={i !== dueSoon.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#FDECC8] text-[#B45309] text-[12px] font-bold flex items-center justify-center">
                      {row.initials}
                    </div>
                    <span className="text-[14px] font-semibold text-[#111827]">
                      {row.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-[14px] text-[#585F6C]">{row.book}</td>
                <td className="px-6 py-4 text-[14px] text-[#585F6C]">{row.date}</td>
                <td className={`px-6 py-4 text-[14px] font-bold ${row.sisaColor}`}>
                  {row.sisaHari}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full ${row.statusColor}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}