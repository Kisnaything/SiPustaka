'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'
import { usePeminjaman } from '@/lib/hooks/usePeminjaman'
import { useMobile } from '@/lib/hooks/useMobile'
import Pagination from '@/components/Pagination'

function buatNomorAnggota(id: string) {
  return 'M-' + id.slice(0, 8).toUpperCase()
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  'Aktif': { bg: '#DCFCE7', color: '#15803D' },
  'Menunggu Konfirmasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Terlambat': { bg: '#FEE2E2', color: '#DC2626' },
  'Selesai': { bg: '#F3F4F6', color: '#6B7280' },
}

const coverColors = ['#374151', '#0E7490', '#C8B89A', '#8FA68B', '#D4A574']

function Badge({ status }: { status: string }) {
  const style = statusStyle[status] ?? { bg: '#F3F4F6', color: '#6B7280' }
  return (
    <span style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '999px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
    }}>
      {status}
    </span>
  )
}

function getTanggalHariIni() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function getDisplayStatus(p: { status: string; jatuh_tempo: string | null }): { label: string; isTerlambat: boolean } {
  if (p.status === 'Aktif' && p.jatuh_tempo && new Date(p.jatuh_tempo) < new Date()) {
    return { label: 'Terlambat', isTerlambat: true }
  }
  return { label: p.status, isTerlambat: false }
}

export default function DashboardPage() {
  const [nama, setNama] = useState('Anggota')
  const [nomorAnggota, setNomorAnggota] = useState('')
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 10
  const isMobile = useMobile()

  const allPeminjaman = usePeminjaman()

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setNama(user.user_metadata?.nama_lengkap || 'Anggota')
        setNomorAnggota(buatNomorAnggota(user.id))
        setUserId(user.id)
      }
      setLoading(false)
    }
    load()
  }, [])

  const myPeminjaman = allPeminjaman.filter((p) => p.anggota_id === userId)
  const peminjamanAktif = myPeminjaman.filter((p) => p.status === 'Aktif' || p.status === 'Menunggu Konfirmasi')
  const totalPages = Math.ceil(peminjamanAktif.length / ITEMS_PER_PAGE)
  const paginatedData = peminjamanAktif.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [peminjamanAktif.length])

  const bukuDipinjam = peminjamanAktif.length

  const sortedByJatuhTempo = [...myPeminjaman]
    .filter((p) => p.status === 'Aktif' && p.jatuh_tempo)
    .sort((a, b) => new Date(a.jatuh_tempo!).getTime() - new Date(b.jatuh_tempo!).getTime())

  const jatuhTempoTerdekat = sortedByJatuhTempo.length > 0
    ? {
        tanggal: new Date(sortedByJatuhTempo[0].jatuh_tempo!).toLocaleDateString('id-ID', {
          day: 'numeric', month: 'short', year: 'numeric',
        }),
        judul: sortedByJatuhTempo[0].buku_judul,
      }
    : { tanggal: '-', judul: 'Tidak ada peminjaman aktif' }

  const dendaAktif = myPeminjaman
    .filter((p) => p.status === 'Selesai' && p.status_denda === 'Belum Lunas')
    .reduce((sum, p) => sum + p.denda, 0)

  if (loading) {
    return (
      <div style={{ padding: '24px 32px', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#9CA3AF' }}>
        Memuat...
      </div>
    )
  }

  return (
    <div style={{
      padding: isMobile ? '16px' : '24px 32px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: '1280px',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '28px',
      }}>
        <span style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500 }}>
          Dashboard
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <div style={{
              width: '10px', height: '10px',
              backgroundColor: '#F5A623',
              borderRadius: '50%',
            }} />
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            margin: 0,
            lineHeight: 1.2,
          }}>
            Selamat datang, {nama}
          </h1>
          <p style={{
            fontSize: '14px',
            color: '#6B7280',
            margin: '8px 0 0',
          }}>
            No. Anggota: {nomorAnggota}&nbsp;&nbsp;|&nbsp;&nbsp;{getTanggalHariIni()}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <Link href="/member/peminjaman" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: '1px solid #F5A623',
            borderRadius: '8px',
            color: '#F5A623',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            backgroundColor: 'transparent',
          }}>
            Lihat Peminjaman
          </Link>
          <Link href="/member/katalog" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#F5A623',
            borderRadius: '8px',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
          }}>
            Cari Buku
          </Link>
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
        gap: isMobile ? '12px' : 0,
        backgroundColor: isMobile ? 'transparent' : '#E5E7EB',
        border: isMobile ? 'none' : '1px solid #E5E7EB',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '40px',
      }}>
        <StatCard label="BUKU DIPINJAM" value={bukuDipinjam} isMobile={isMobile}>
          {bukuDipinjam > 0 && <Badge status="Aktif" />}
        </StatCard>
        <StatCard
          label="JATUH TEMPO TERDEKAT"
          value={jatuhTempoTerdekat.tanggal}
          sub={jatuhTempoTerdekat.judul}
          isMobile={isMobile}
        />
        <StatCard label="DENDA AKTIF" value={`Rp ${dendaAktif.toLocaleString('id-ID')}`} isMobile={isMobile} isRed={dendaAktif > 0}>
          {dendaAktif > 0 && <Badge status="Belum Lunas" />}
        </StatCard>
      </div>

      <div>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: 0 }}>
            Peminjaman Aktif
          </h2>
          <Link href="/member/peminjaman" style={{
            fontSize: '14px',
            color: '#D4891A',
            textDecoration: 'none',
            fontWeight: 500,
          }}>
            Lihat Semua →
          </Link>
        </div>

        <div style={{
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          overflowX: 'auto',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          WebkitOverflowScrolling: 'touch',
        }}>
          <div style={{ minWidth: isMobile ? '640px' : 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
              backgroundColor: '#F9FAFB',
              padding: '12px 20px',
              borderBottom: '1px solid #E5E7EB',
            }}>
              {['BUKU', 'TANGGAL PINJAM', 'JATUH TEMPO', 'STATUS', 'AKSI'].map((h) => (
                <span key={h} style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  letterSpacing: '0.04em',
                }}>
                  {h}
                </span>
              ))}
            </div>

            {peminjamanAktif.length === 0 ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
                <p style={{ fontSize: '14px', margin: 0 }}>Tidak ada peminjaman aktif.</p>
              </div>
            ) : (
              paginatedData.map((item, i) => {
                const display = getDisplayStatus(item)
                return (
                  <div
                    key={item.id}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
                      padding: '16px 20px',
                      borderBottom: i < paginatedData.length - 1 ? '1px solid #E5E7EB' : 'none',
                      alignItems: 'center',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFBF0')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '40px',
                        height: '54px',
                        backgroundColor: coverColors[parseInt(item.id) % coverColors.length],
                        borderRadius: '4px',
                        flexShrink: 0,
                      }} />
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                        {item.buku_judul}
                      </p>
                    </div>

                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {item.tanggal_pinjam
                        ? new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '-'}
                    </span>
                    <span style={{ fontSize: '14px', color: '#374151' }}>
                      {item.jatuh_tempo
                        ? new Date(item.jatuh_tempo).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
                        : '-'}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <Badge status={display.label} />
                    </div>

                    <button style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#6B7280',
                      fontSize: '20px',
                      padding: '4px 8px',
                      letterSpacing: '2px',
                    }}>
                      ⋮
                    </button>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={peminjamanAktif.length}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

function StatCard({ label, value, sub, children, isMobile, isRed }: {
  label: string; value: string | number; sub?: string; children?: React.ReactNode; isMobile: boolean; isRed?: boolean;
}) {
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      padding: '28px 24px',
      borderRadius: isMobile ? '12px' : 0,
      border: isMobile ? '1px solid #E5E7EB' : 'none',
    }}>
      <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.05em' }}>
        {label}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <span style={{ fontSize: '32px', fontWeight: 700, color: isRed ? '#DC2626' : '#111827' }}>
          {value}
        </span>
        {children}
      </div>
      {sub && <p style={{ fontSize: '13px', color: '#6B7280', margin: '4px 0 0' }}>{sub}</p>}
    </div>
  )
}
