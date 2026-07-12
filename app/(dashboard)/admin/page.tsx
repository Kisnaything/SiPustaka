'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
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
import { supabase } from '@/lib/supabase/client';
import { useBuku } from '@/lib/hooks/useBuku';
import { useAnggota } from '@/lib/hooks/useAnggota';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';
import { useNotifikasi } from '@/lib/hooks/useNotifikasi';

// ─── Helper ──────────────────────────────────────────────────
function getStatusBadge(days: number) {
  if (days <= 1) return { label: 'KRITIS', color: 'bg-[#FEE2E2] text-[#DC2626]' };
  if (days <= 3) return { label: 'MENDEKATI', color: 'bg-[#FDECC8] text-[#B45309]' };
  return { label: 'AMAN', color: 'bg-[#F3F4F6] text-[#585F6C]' };
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DashboardPage() {
  // ─── Ambil nama admin ────────────────────────────────
  const [adminName, setAdminName] = useState('Admin');

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.user_metadata?.nama_lengkap) {
        setAdminName(user.user_metadata.nama_lengkap);
      }
    });
  }, []);

  // ─── HOOKS (dipanggil di level atas) ──────────────────
  const { books: bukuList, loading: loadingBuku } = useBuku();
  const { anggota: anggotaList } = useAnggota();
  const peminjamanList = usePeminjaman();
  const notifList = useNotifikasi();

  const [now] = useState(() => Date.now());
  const [year, setYear] = useState('Tahun ' + new Date().getFullYear());

  // ─── useMemo (sebelum conditional return) ──────────────
  const stats = useMemo(() => {
    const totalBuku = bukuList.length;
    const anggotaAktif = anggotaList.filter((a) => a.status === 'AKTIF').length;
    const peminjamanAktif = peminjamanList.filter((p) => p.status === 'Aktif').length;
    const dendaBelumLunas = peminjamanList.filter(
      (p) => p.status === 'Selesai' && p.status_denda === 'Belum Lunas'
    ).length;

    return {
      totalBuku,
      anggotaAktif,
      peminjamanAktif,
      dendaBelumLunas,
    };
  }, [bukuList, anggotaList, peminjamanList]);

  const activityIcons: Record<string, { icon: typeof LogIn; bg: string; color: string }> = {
    peminjaman_baru: { icon: LogIn, bg: 'bg-[#DBEAFE]', color: 'text-[#2563EB]' },
    info: { icon: Upload, bg: 'bg-[#FDECC8]', color: 'text-[#B45309]' },
    pengembalian: { icon: CornerUpLeft, bg: 'bg-[#D1FAE5]', color: 'text-[#059669]' },
    verifikasi_denda: { icon: CreditCard, bg: 'bg-[#D1FAE5]', color: 'text-[#059669]' },
    buku_baru: { icon: Plus, bg: 'bg-[#DBEAFE]', color: 'text-[#2563EB]' },
    buku_diedit: { icon: BookOpen, bg: 'bg-[#FDECC8]', color: 'text-[#B45309]' },
    anggota_baru: { icon: Users, bg: 'bg-[#DBEAFE]', color: 'text-[#2563EB]' },
  }

  const recentActivities = useMemo(() => {
    const top = notifList.slice(0, 4);

    return top.map((n) => {
      const icon = activityIcons[n.tipe]?.icon || AlertCircle;
      const iconBg = activityIcons[n.tipe]?.bg || 'bg-[#F3F4F6]';
      const iconColor = activityIcons[n.tipe]?.color || 'text-[#6B7280]';

      const diffMs = now - new Date(n.created_at).getTime();
      const diffMin = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      let time = 'Baru saja';
      if (diffMin >= 1 && diffMin < 60) time = `${diffMin} menit yang lalu`;
      else if (diffHours < 24) time = `${diffHours} jam yang lalu`;
      else if (diffHours < 48) time = 'Kemarin';
      else time = `${Math.floor(diffHours / 24)} hari yang lalu`;

      return { icon, iconBg, iconColor, title: n.pesan, time };
    });
  }, [notifList, now]);

  const dueSoonData = useMemo(() => {
    const now = new Date();
    const aktif = peminjamanList.filter(
      (p) => p.status === 'Aktif' && p.jatuh_tempo
    );
    const sorted = aktif.sort(
      (a, b) => new Date(a.jatuh_tempo!).getTime() - new Date(b.jatuh_tempo!).getTime()
    );
    const top = sorted.slice(0, 3);

    return top.map((p) => {
      const days = Math.ceil(
        (new Date(p.jatuh_tempo!).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      const status = getStatusBadge(days);
      return {
        initials: p.anggota_nama.slice(0, 2).toUpperCase(),
        name: p.anggota_nama,
        book: p.buku_judul,
        date: formatDate(p.tanggal_pinjam || p.tanggal_reservasi),
        sisaHari: days <= 0 ? 'Hari ini' : `${days} Hari`,
        status: status.label,
        statusColor: status.color,
        sisaColor: days <= 1 ? 'text-[#DC2626]' : days <= 3 ? 'text-[#B45309]' : 'text-[#111827]',
      };
    });
  }, [peminjamanList]);

  const monthData = useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const selectedYear = parseInt(year.replace('Tahun ', '')) || new Date().getFullYear();
    const counts = Array(12).fill(0);

    peminjamanList.forEach((p) => {
      const date = p.tanggal_pinjam ? new Date(p.tanggal_pinjam) : new Date(p.tanggal_reservasi);
      if (date.getFullYear() === selectedYear) {
        const month = date.getMonth();
        counts[month] += 1;
      }
    });

    const now = new Date();
    const currentMonth = now.getMonth();
    const start = Math.max(0, currentMonth - 7);
    const labels = months.slice(start, currentMonth + 1);
    const values = counts.slice(start, currentMonth + 1);

    return { labels, values };
  }, [peminjamanList, year]);

  const maxValue = Math.max(...monthData.values, 1);

  // ─── Trend peminjaman (month-over-month) ───────────────
  const currentMonthCount = monthData.values[monthData.values.length - 1] || 0;
  const prevMonthCount = monthData.values.length > 1 ? monthData.values[monthData.values.length - 2] || 0 : 0;
  const chartTrend = currentMonthCount - prevMonthCount;

  // ─── Conditional rendering ─────────────────────────────
  if (loadingBuku) {
    return <div className="p-6 text-[#585F6C]">Loading...</div>;
  }

  // ─── Stat cards ──────────────────────────────────────────
  const statCards = [
    {
      label: 'Total Buku',
      value: stats.totalBuku.toString(),
      trend: chartTrend > 0 ? `+${chartTrend}` : chartTrend < 0 ? `${chartTrend}` : '0',
      trendUp: chartTrend >= 0,
      icon: BookOpen,
      iconBg: 'bg-[#FDECC8]',
      iconColor: 'text-[#B45309]',
      barColor: 'bg-[#F5A623]',
    },
    {
      label: 'Anggota Aktif',
      value: stats.anggotaAktif.toString(),
      trend: `${anggotaList.filter((a) => a.status === 'AKTIF').length}`,
      trendUp: true,
      icon: Users,
      iconBg: 'bg-[#DBEAFE]',
      iconColor: 'text-[#2563EB]',
      barColor: 'bg-[#3B82F6]',
    },
    {
      label: 'Peminjaman Aktif',
      value: stats.peminjamanAktif.toString(),
      trend: stats.peminjamanAktif > 0 ? `+${stats.peminjamanAktif}` : '0',
      trendUp: stats.peminjamanAktif > 0,
      icon: RefreshCw,
      iconBg: 'bg-[#FDECC8]',
      iconColor: 'text-[#B45309]',
      barColor: 'bg-[#F5A623]',
    },
    {
      label: 'Denda Belum Lunas',
      value: stats.dendaBelumLunas.toString(),
      trend: 'Penting',
      trendUp: false,
      urgent: true,
      icon: CreditCard,
      iconBg: 'bg-[#FEE2E2]',
      iconColor: 'text-[#DC2626]',
      barColor: 'bg-[#EF4444]',
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-[#111827]">
            Selamat Datang Kembali, {adminName}!
          </h1>
          <p className="text-[14px] font-medium text-[#585F6C] mt-1">
            Berikut adalah ringkasan performa perpustakaan SiPustaka hari ini.
          </p>
        </div>
        <Link
          href="/admin/buku/tambah"
          className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm"
        >
          <Plus size={18} strokeWidth={2.5} />
          Tambah Buku Baru
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mt-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trendUp ? TrendingUp : TrendingDown;
          return (
            <div
              key={stat.label}
              className={`relative bg-white rounded-xl border border-[#E5E7EB] p-5 overflow-hidden`}
            >
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${stat.barColor}`} />
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
              <p className="text-[28px] font-bold text-[#111827] mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-[1fr_360px] gap-4 mt-6">
        {/* Chart */}
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
                <option>Tahun {new Date().getFullYear()}</option>
                <option>Tahun {new Date().getFullYear() - 1}</option>
              </select>
              <ChevronDown
                size={16}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#585F6C] pointer-events-none"
              />
            </div>
          </div>

          <div className="flex items-end justify-between gap-3 h-[280px] mt-6 px-1">
            {monthData.labels.map((month, i) => (
              <div key={month} className="flex-1 flex flex-col items-center gap-3 h-full justify-end">
                <div
                  className="w-full max-w-[36px] rounded-t-md bg-[#F5A623]/80 hover:bg-[#F5A623] transition-colors"
                  style={{
                    height: `${Math.max((monthData.values[i] / maxValue) * 100, 4)}%`,
                  }}
                />
                <span
                  className={`text-[12px] font-medium ${
                    i === monthData.labels.length - 1 ? 'text-[#B45309] font-semibold' : 'text-[#585F6C]'
                  }`}
                >
                  {month}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <h2 className="text-[16px] font-bold text-[#111827]">Aktivitas Terbaru</h2>
          <div className="mt-5 relative">
            {recentActivities.length === 0 ? (
              <p className="text-[13px] text-[#9CA3AF] text-center py-6">Belum ada aktivitas.</p>
            ) : (
              recentActivities.map((activity, i) => {
                const Icon = activity.icon;
                const isLast = i === recentActivities.length - 1;
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
              })
            )}
          </div>
        </div>
      </div>

      {/* Due soon table */}
      <div className="bg-white rounded-xl border border-[#E5E7EB] mt-6">
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-[16px] font-bold text-[#111827]">
            Peminjaman Akan Jatuh Tempo
          </h2>
          <Link href="/admin/peminjaman" className="text-[13px] font-semibold text-[#B45309] hover:underline">
            Lihat Semua
          </Link>
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
            {dueSoonData.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-[#9CA3AF]">
                  Tidak ada peminjaman aktif yang mendekati jatuh tempo.
                </td>
              </tr>
            ) : (
              dueSoonData.map((row, i) => (
                <tr
                  key={row.name + i}
                  className={i !== dueSoonData.length - 1 ? 'border-b border-[#F3F4F6]' : ''}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#FDECC8] text-[#B45309] text-[12px] font-bold flex items-center justify-center">
                        {row.initials}
                      </div>
                      <span className="text-[14px] font-semibold text-[#111827]">{row.name}</span>
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}