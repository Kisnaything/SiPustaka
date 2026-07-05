'use client';

import { useState } from 'react';
import {
  Bell,
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
  BookOpen,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  User,
  FileText,
  Calendar,
  Check,
  Eye,
  MoreHorizontal,
} from 'lucide-react';

// ─── Tipe Notifikasi ──────────────────────────────────────────
type NotificationType =
  | 'peminjaman_baru'
  | 'verifikasi_denda'
  | 'pengembalian'
  | 'anggota_baru'
  | 'sistem'
  | 'denda';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  time: Date;
  read: boolean;
  actionLabel?: string;
  actionLink?: string;
}

// ─── Data Dummy ──────────────────────────────────────────────
const dummyNotifications: Notification[] = [
  {
    id: '1',
    type: 'peminjaman_baru',
    title: 'Peminjaman Baru Diajukan',
    description: 'Ahmad Fauzi mengajukan peminjaman "Struktur Data & Algoritma"',
    time: new Date(Date.now() - 2 * 60 * 1000),
    read: false,
    actionLabel: 'Verifikasi Sekarang',
    actionLink: '/admin/peminjaman',
  },
  {
    id: '2',
    type: 'verifikasi_denda',
    title: 'Bukti Bayar Denda Menunggu Verifikasi',
    description: 'Rina Sari mengunggah bukti bayar denda sebesar Rp 15.000',
    time: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    actionLabel: 'Lihat Bukti',
    actionLink: '/admin/verifikasi',
  },
  {
    id: '3',
    type: 'pengembalian',
    title: 'Pengembalian Buku Dikonfirmasi',
    description: 'Budi Santoso mengembalikan buku "Clean Code" tepat waktu',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: false,
  },
  {
    id: '4',
    type: 'anggota_baru',
    title: 'Pendaftaran Anggota Baru',
    description: 'Siti Aminah telah berhasil diverifikasi dan terdaftar sebagai anggota "Mahasiswa"',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    actionLabel: 'Lihat Profil',
    actionLink: '/admin/anggota',
  },
  {
    id: '5',
    type: 'sistem',
    title: 'Pembaruan Sistem Berhasil',
    description: 'Sistem SiPustaka telah diperbarui ke versi 2.4.1. Perbaikan pada modul laporan dan optimasi basis data.',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
  },
  {
    id: '6',
    type: 'denda',
    title: 'Denda Keterlambatan',
    description: 'Andi Wijaya dikenakan denda keterlambatan sebesar Rp 10.000 untuk buku "Filosofi Teras"',
    time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    read: true,
  },
];

// ─── Icon Mapping ────────────────────────────────────────────
const iconMap: Record<NotificationType, { icon: React.ReactNode; bg: string; color: string }> =
  {
    peminjaman_baru: {
      icon: <BookOpen size={16} />,
      bg: 'bg-[#DBEAFE]',
      color: 'text-[#2563EB]',
    },
    verifikasi_denda: {
      icon: <ShieldCheck size={16} />,
      bg: 'bg-[#FEF9C3]',
      color: 'text-[#854D0E]',
    },
    pengembalian: {
      icon: <RotateCcw size={16} />,
      bg: 'bg-[#D1FAE5]',
      color: 'text-[#059669]',
    },
    anggota_baru: {
      icon: <UserPlus size={16} />,
      bg: 'bg-[#E0E7FF]',
      color: 'text-[#4338CA]',
    },
    sistem: {
      icon: <Bell size={16} />,
      bg: 'bg-[#F3F4F6]',
      color: 'text-[#6B7280]',
    },
    denda: {
      icon: <AlertCircle size={16} />,
      bg: 'bg-[#FEE2E2]',
      color: 'text-[#DC2626]',
    },
  };

// ─── Badge Waktu ─────────────────────────────────────────────
function TimeBadge({ date }: { date: Date }) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  let label = '';
  if (diffMin < 1) label = 'Baru saja';
  else if (diffMin < 60) label = `${diffMin} menit yang lalu`;
  else if (diffHours < 24) label = `${diffHours} jam yang lalu`;
  else if (diffDays < 7) label = `${diffDays} hari yang lalu`;
  else label = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return <span className="text-[12px] text-[#9CA3AF]">{label}</span>;
}

export default function NotifikasiPage() {
  const [notifications, setNotifications] = useState<Notification[]>(dummyNotifications);
  const [activeTab, setActiveTab] = useState<'semua' | 'belum_dibaca' | 'sistem'>('semua');

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filtered = notifications.filter((n) => {
    if (activeTab === 'belum_dibaca') return !n.read;
    if (activeTab === 'sistem') return n.type === 'sistem';
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div>
      {/* ─── Header ─── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Pusat Notifikasi</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Kelola semua aktivitas sistem dan pemberitahuan anggota di satu tempat.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E0951C] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl transition-colors shadow-sm"
          >
            <Check size={16} />
            Tandai Semua Sudah Dibaca
          </button>
        )}
      </div>

      {/* ─── Tabs ─── */}
      <div className="flex items-center gap-6 border-b border-[#E5E7EB] mt-6">
        <button
          onClick={() => setActiveTab('semua')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'semua'
              ? 'text-[#B45309] border-b-2 border-[#B45309]'
              : 'text-[#585F6C] hover:text-[#111827]'
          }`}
        >
          Semua
          <span className="text-[11px] font-bold bg-[#F3F4F6] text-[#585F6C] px-2 py-0.5 rounded-full">
            {notifications.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('belum_dibaca')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'belum_dibaca'
              ? 'text-[#B45309] border-b-2 border-[#B45309]'
              : 'text-[#585F6C] hover:text-[#111827]'
          }`}
        >
          Belum Dibaca
          {unreadCount > 0 && (
            <span className="text-[11px] font-bold bg-[#DC2626] text-white px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sistem')}
          className={`pb-3 px-1 text-[14px] font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'sistem'
              ? 'text-[#B45309] border-b-2 border-[#B45309]'
              : 'text-[#585F6C] hover:text-[#111827]'
          }`}
        >
          Sistem
        </button>
      </div>

      {/* ─── List Notifikasi ─── */}
      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
            <Bell size={40} className="text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-[#585F6C] text-[15px] font-medium">
              {activeTab === 'belum_dibaca'
                ? 'Tidak ada notifikasi yang belum dibaca.'
                : activeTab === 'sistem'
                ? 'Tidak ada notifikasi sistem.'
                : 'Belum ada notifikasi.'}
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const meta = iconMap[notif.type];
            const isUnread = !notif.read;

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl border ${
                  isUnread ? 'border-l-4 border-l-[#F5A623] border-[#E5E7EB]' : 'border-[#E5E7EB]'
                } p-5 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}
                  >
                    {meta.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold text-[#111827]">{notif.title}</p>
                        <p className="text-[13px] text-[#585F6C] mt-0.5">{notif.description}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <TimeBadge date={notif.time} />
                        {isUnread && (
                          <span className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-3">
                      {notif.actionLabel && notif.actionLink && (
                        <a
                          href={notif.actionLink}
                          className="text-[13px] font-semibold text-[#B45309] hover:underline flex items-center gap-1"
                        >
                          {notif.actionLabel}
                          <Eye size={14} />
                        </a>
                      )}
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="text-[12px] font-medium text-[#9CA3AF] hover:text-[#585F6C] transition-colors"
                        >
                          Tandai sudah dibaca
                        </button>
                      )}
                    </div>
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