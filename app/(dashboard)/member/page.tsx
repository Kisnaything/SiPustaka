'use client'

import Link from 'next/link'

// Data dummy — nanti diganti data asli dari Supabase
const dataDummy = {
  nama: 'Sinta Maharani',
  nomorAnggota: 'A-20240041',
  bukuDipinjam: 2,
  jatuhTempoTerdekat: {
    tanggal: '26 Jun 2026',
    judul: 'Pemrograman Web Modern',
  },
  dendaAktif: 0,
  peminjaman: [
    {
      id: '1',
      judul: 'Pemrograman Web Modern',
      jenis: 'Buku Fisik',
      cover: null,
      tanggalPinjam: '12 Jun 2026',
      jatuhTempo: '26 Jun 2026',
      status: 'Aktif',
    },
    {
      id: '2',
      judul: 'Basis Data Lanjutan',
      jenis: 'E-Book',
      cover: null,
      tanggalPinjam: '10 Jun 2026',
      jatuhTempo: '24 Jun 2026',
      status: 'Menunggu Verifikasi',
    },
  ],
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  'Aktif': { bg: '#DCFCE7', color: '#15803D' },
  'Menunggu Verifikasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Terlambat': { bg: '#FEE2E2', color: '#DC2626' },
  'Selesai': { bg: '#F3F4F6', color: '#6B7280' },
}

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

// Dapatkan hari & tanggal hari ini dalam Bahasa Indonesia
function getTanggalHariIni() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function DashboardPage() {
  const { nama, nomorAnggota, bukuDipinjam, jatuhTempoTerdekat, dendaAktif, peminjaman } = dataDummy

  return (
    <div style={{
      padding: '24px 32px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: '1280px',
    }}>

      {/* Header atas */}
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
          {/* Notifikasi dot */}
          <div style={{ position: 'relative', cursor: 'pointer' }}>
            <div style={{
              width: '10px', height: '10px',
              backgroundColor: '#F5A623',
              borderRadius: '50%',
            }} />
          </div>
          {/* Settings icon */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>
          </svg>
        </div>
      </div>

      {/* Welcome section */}
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
            <svg width="16" height="16" viewBox="0 0 18 20" fill="none">
              <path d="M3 20C2.16667 20 1.45833 19.7083 0.875 19.125C0.291667 18.5417 0 17.8333 0 17V14H3V0L4.5 1.5L6 0L7.5 1.5L9 0L10.5 1.5L12 0L13.5 1.5L15 0L16.5 1.5L18 0V17C18 17.8333 17.7083 18.5417 17.125 19.125C16.5417 19.7083 15.8333 20 15 20H3ZM15 18C15.2833 18 15.5208 17.9042 15.7125 17.7125C15.9042 17.5208 16 17.2833 16 17V3H5V14H14V17C14 17.2833 14.0958 17.5208 14.2875 17.7125C14.4792 17.9042 14.7167 18 15 18ZM6 7V5H12V7H6ZM6 10V8H12V10H6ZM3 18H12V16H2V17C2 17.2833 2.09583 17.5208 2.2875 17.7125C2.47917 17.9042 2.71667 18 3 18Z" fill="#F5A623"/>
            </svg>
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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            Cari Buku
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '1px',
        backgroundColor: '#E5E7EB',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        overflow: 'hidden',
        marginBottom: '40px',
      }}>
        {/* Buku Dipinjam */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px' }}>
          <div style={{
            width: '48px', height: '48px',
            backgroundColor: '#E0F2FE',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
              <path d="M13 5.9V4.2C13.55 3.96667 14.1125 3.79167 14.6875 3.675C15.2625 3.55833 15.8667 3.5 16.5 3.5C16.9333 3.5 17.3583 3.53333 17.775 3.6C18.1917 3.66667 18.6 3.75 19 3.85V5.45C18.6 5.3 18.1958 5.1875 17.7875 5.1125C17.3792 5.0375 16.95 5 16.5 5C15.8667 5 15.2583 5.07917 14.675 5.2375C14.0917 5.39583 13.5333 5.61667 13 5.9ZM13 11.4V9.7C13.55 9.46667 14.1125 9.29167 14.6875 9.175C15.2625 9.05833 15.8667 9 16.5 9C16.9333 9 17.3583 9.03333 17.775 9.1C18.1917 9.16667 18.6 9.25 19 9.35V10.95C18.6 10.8 18.1958 10.6875 17.7875 10.6125C17.3792 10.5375 16.95 10.5 16.5 10.5C15.8667 10.5 15.2583 10.575 14.675 10.725C14.0917 10.875 13.5333 11.1 13 11.4ZM13 8.65V6.95C13.55 6.71667 14.1125 6.54167 14.6875 6.425C15.2625 6.30833 15.8667 6.25 16.5 6.25C16.9333 6.25 17.3583 6.28333 17.775 6.35C18.1917 6.41667 18.6 6.5 19 6.6V8.2C18.6 8.05 18.1958 7.9375 17.7875 7.8625C17.3792 7.7875 16.95 7.75 16.5 7.75C15.8667 7.75 15.2583 7.82917 14.675 7.9875C14.0917 8.14583 13.5333 8.36667 13 8.65ZM5.5 12C6.28333 12 7.04583 12.0875 7.7875 12.2625C8.52917 12.4375 9.26667 12.7 10 13.05V3.2C9.31667 2.8 8.59167 2.5 7.825 2.3C7.05833 2.1 6.28333 2 5.5 2C4.9 2 4.30417 2.05833 3.7125 2.175C3.12083 2.29167 2.55 2.46667 2 2.7V12.6C2.58333 12.4 3.1625 12.25 3.7375 12.15C4.3125 12.05 4.9 12 5.5 12ZM12 13.05C12.7333 12.7 13.4708 12.4375 14.2125 12.2625C14.9542 12.0875 15.7167 12 16.5 12C17.1 12 17.6875 12.05 18.2625 12.15C18.8375 12.25 19.4167 12.4 20 12.6V2.7C19.45 2.46667 18.8792 2.29167 18.2875 2.175C17.6958 2.05833 17.1 2 16.5 2C15.7167 2 14.9417 2.1 14.175 2.3C13.4083 2.5 12.6833 2.8 12 3.2V13.05ZM11 16C10.2 15.3667 9.33333 14.875 8.4 14.525C7.46667 14.175 6.5 14 5.5 14C4.8 14 4.1125 14.0917 3.4375 14.275C2.7625 14.4583 2.11667 14.7167 1.5 15.05C1.15 15.2333 0.8125 15.225 0.4875 15.025C0.1625 14.825 0 14.5333 0 14.15V2.1C0 1.91667 0.0458333 1.74167 0.1375 1.575C0.229167 1.40833 0.366667 1.28333 0.55 1.2C1.31667 0.8 2.11667 0.5 2.95 0.3C3.78333 0.1 4.63333 0 5.5 0C6.46667 0 7.4125 0.125 8.3375 0.375C9.2625 0.625 10.15 1 11 1.5C11.85 1 12.7375 0.625 13.6625 0.375C14.5875 0.125 15.5333 0 16.5 0C17.3667 0 18.2167 0.1 19.05 0.3C19.8833 0.5 20.6833 0.8 21.45 1.2C21.6333 1.28333 21.7708 1.40833 21.8625 1.575C21.9542 1.74167 22 1.91667 22 2.1V14.15C22 14.5333 21.8375 14.825 21.5125 15.025C21.1875 15.225 20.85 15.2333 20.5 15.05C19.8833 14.7167 19.2375 14.4583 18.5625 14.275C17.8875 14.0917 17.2 14 16.5 14C15.5 14 14.5333 14.175 13.6 14.525C12.6667 14.875 11.8 15.3667 11 16Z" fill="#0284C7"/>
            </svg>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.05em' }}>
            BUKU DIPINJAM
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#111827' }}>{bukuDipinjam}</span>
            <Badge status="Aktif" />
          </div>
        </div>

        {/* Jatuh Tempo Terdekat */}
        <div style={{
          backgroundColor: '#FFFFFF',
          padding: '28px 24px',
          borderLeft: '1px solid #E5E7EB',
          borderRight: '1px solid #E5E7EB',
        }}>
          <div style={{
            width: '48px', height: '48px',
            backgroundColor: '#FEF3DC',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D4891A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.05em' }}>
            JATUH TEMPO TERDEKAT
          </p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#111827', margin: '0 0 4px' }}>
            {jatuhTempoTerdekat.tanggal}
          </p>
          <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
            {jatuhTempoTerdekat.judul}
          </p>
        </div>

        {/* Denda Aktif */}
        <div style={{ backgroundColor: '#FFFFFF', padding: '28px 24px' }}>
          <div style={{
            width: '48px', height: '48px',
            backgroundColor: '#DCFCE7',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '16px',
          }}>
            <svg width="20" height="16" viewBox="0 0 22 16" fill="none">
              <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="#16A34A"/>
            </svg>
          </div>
          <p style={{ fontSize: '12px', fontWeight: 500, color: '#6B7280', margin: '0 0 8px', letterSpacing: '0.05em' }}>
            DENDA AKTIF
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '32px', fontWeight: 700, color: '#16A34A' }}>
              Rp {dendaAktif.toLocaleString('id-ID')}
            </span>
            <Badge status="Aktif" />
          </div>
        </div>
      </div>

      {/* Tabel Peminjaman Aktif */}
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
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}>
          {/* Header tabel */}
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

          {/* Rows */}
          {peminjaman.map((item, i) => (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 60px',
                padding: '16px 20px',
                borderBottom: i < peminjaman.length - 1 ? '1px solid #E5E7EB' : 'none',
                alignItems: 'center',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFFBF0')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {/* Buku */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '54px',
                  backgroundColor: '#E5E7EB',
                  borderRadius: '4px',
                  flexShrink: 0,
                }} />
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0 }}>
                    {item.judul}
                  </p>
                  <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0' }}>
                    {item.jenis}
                  </p>
                </div>
              </div>

              <span style={{ fontSize: '14px', color: '#374151' }}>{item.tanggalPinjam}</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>{item.jatuhTempo}</span>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Badge status={item.status} />
                </div>

              {/* Tombol aksi (titik tiga) */}
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
          ))}
        </div>
      </div>
    </div>
  )
}