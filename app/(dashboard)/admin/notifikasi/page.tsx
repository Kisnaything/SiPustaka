'use client'

import { useState } from 'react'
import { Bell, BookOpen, ShieldCheck, RotateCcw, UserPlus, AlertCircle, Check } from 'lucide-react'
import { useNotifikasi } from '@/lib/hooks/useNotifikasi'
import { tandaiDibaca } from '@/lib/data/notifikasi'

const iconMap: Record<string, { icon: React.ReactNode; bg: string; color: string }> = {
  peminjaman_baru: {
    icon: <BookOpen size={16} />, bg: 'bg-[#DBEAFE]', color: 'text-[#2563EB]',
  },
  verifikasi_denda: {
    icon: <ShieldCheck size={16} />, bg: 'bg-[#FEF9C3]', color: 'text-[#854D0E]',
  },
  pengembalian: {
    icon: <RotateCcw size={16} />, bg: 'bg-[#D1FAE5]', color: 'text-[#059669]',
  },
  anggota_baru: {
    icon: <UserPlus size={16} />, bg: 'bg-[#E0E7FF]', color: 'text-[#4338CA]',
  },
  denda: {
    icon: <AlertCircle size={16} />, bg: 'bg-[#FEE2E2]', color: 'text-[#DC2626]',
  },
}

function TimeBadge({ date }: { date: string }) {
  const now = new Date()
  const d = new Date(date)
  const diffMs = now.getTime() - d.getTime()
  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  let label = ''
  if (diffMin < 1) label = 'Baru saja'
  else if (diffMin < 60) label = `${diffMin} menit yang lalu`
  else if (diffHours < 24) label = `${diffHours} jam yang lalu`
  else if (diffDays < 7) label = `${diffDays} hari yang lalu`
  else label = d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })

  return <span className="text-[12px] text-[#9CA3AF]">{label}</span>
}

export default function NotifikasiPage() {
  const notifications = useNotifikasi()
  const [activeTab, setActiveTab] = useState<'semua' | 'belum_dibaca'>('semua')

  const handleMarkRead = async (id: string) => {
    await tandaiDibaca(id)
  }

  const filtered = notifications.filter((n) => {
    if (activeTab === 'belum_dibaca') return !n.dibaca
    return true
  })

  const unreadCount = notifications.filter((n) => !n.dibaca).length

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Pusat Notifikasi</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Kelola semua aktivitas sistem dan pemberitahuan anggota di satu tempat.
          </p>
        </div>
      </div>

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
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-12 text-center">
            <Bell size={40} className="text-[#E5E7EB] mx-auto mb-4" />
            <p className="text-[#585F6C] text-[15px] font-medium">
              {activeTab === 'belum_dibaca'
                ? 'Tidak ada notifikasi yang belum dibaca.'
                : 'Belum ada notifikasi.'}
            </p>
          </div>
        ) : (
          filtered.map((notif) => {
            const meta = iconMap[notif.tipe] || {
              icon: <Bell size={16} />, bg: 'bg-[#F3F4F6]', color: 'text-[#6B7280]',
            }

            return (
              <div
                key={notif.id}
                className={`bg-white rounded-xl border ${
                  !notif.dibaca ? 'border-l-4 border-l-[#F5A623] border-[#E5E7EB]' : 'border-[#E5E7EB]'
                } p-5 hover:shadow-sm transition-shadow`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${meta.bg} ${meta.color}`}>
                    {meta.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-[14px] font-semibold text-[#111827]">{notif.judul}</p>
                        <p className="text-[13px] text-[#585F6C] mt-0.5">{notif.pesan}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <TimeBadge date={notif.created_at} />
                        {!notif.dibaca && <span className="w-2 h-2 rounded-full bg-[#F5A623] shrink-0" />}
                      </div>
                    </div>
                    {!notif.dibaca && (
                      <button
                        onClick={() => handleMarkRead(notif.id)}
                        className="mt-3 text-[12px] font-medium text-[#9CA3AF] hover:text-[#585F6C] transition-colors flex items-center gap-1"
                      >
                        <Check size={12} />
                        Tandai sudah dibaca
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
