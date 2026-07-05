'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'

const dummyPeminjaman = [
  {
    id: '1', kode: 'PJM-2026-0321',
    status: 'Aktif',
    tanggalPinjam: '12 Jun 2026',
    jatuhTempo: '26 Jun 2026',
    hariTerlambat: 0,
    dendaPerHari: 1000,
    buku: [
      { judul: 'Pemrograman Web Modern', penulis: 'Budi Raharjo', coverColor: '#C8B89A' },
      { judul: 'Basis Data Lanjutan', penulis: 'Fathansyah', coverColor: '#6B7E8F' },
      { judul: 'Algoritma & Struktur Data', penulis: 'Rinaldi Munir', coverColor: '#374151' },
    ],
  },
  {
    id: '2', kode: 'PJM-2026-0318',
    status: 'Menunggu Verifikasi',
    tanggalPinjam: '10 Jun 2026',
    jatuhTempo: '24 Jun 2026',
    hariTerlambat: 0,
    dendaPerHari: 1000,
    buku: [
      { judul: 'Basis Data Lanjutan', penulis: 'Fathansyah', coverColor: '#6B7E8F' },
    ],
  },
  {
    id: '3', kode: 'PJM-2026-0312',
    status: 'Terlambat',
    tanggalPinjam: '07 Jun 2026',
    jatuhTempo: '21 Jun 2026',
    hariTerlambat: 5,
    dendaPerHari: 1000,
    buku: [
      { judul: 'Algoritma & Struktur Data', penulis: 'Rinaldi Munir', coverColor: '#374151' },
      { judul: 'Kalkulus', penulis: 'Purcell', coverColor: '#1E293B' },
    ],
  },
  {
    id: '4', kode: 'PJM-2026-0304',
    status: 'Selesai',
    tanggalPinjam: '05 Jun 2026',
    jatuhTempo: '19 Jun 2026',
    hariTerlambat: 0,
    dendaPerHari: 1000,
    buku: [
      { judul: 'Kalkulus', penulis: 'Purcell', coverColor: '#1E293B' },
    ],
  },
]

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
      display: 'inline-flex', alignItems: 'center',
      backgroundColor: style.bg, color: style.color,
      borderRadius: '999px', padding: '4px 12px',
      fontSize: '12px', fontWeight: 500,
    }}>
      {status}
    </span>
  )
}

export default function DetailPeminjamanPage() {
  const params = useParams()
  const id = params.id as string
  const data = dummyPeminjaman.find((p) => p.id === id)

  if (!data) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ color: '#6B7280' }}>Data peminjaman tidak ditemukan.</p>
        <Link href="/member/peminjaman" style={{ color: '#F5A623', fontSize: '14px' }}>← Kembali ke Peminjaman</Link>
      </div>
    )
  }

  const terlambat = data.status === 'Terlambat'
  const totalDenda = data.hariTerlambat * data.dendaPerHari

  return (
    <div style={{ padding: '28px 32px', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '900px', margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '28px', fontSize: '14px' }}>
        <Link href="/member/peminjaman" style={{ color: '#6B7280', textDecoration: 'none' }}>
          Peminjaman
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span style={{ color: '#111827', fontWeight: 500 }}>Detail Peminjaman</span>
      </div>

      {/* Card info utama */}
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        backgroundColor: '#FFFFFF',
        padding: '24px',
        marginBottom: '28px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
      }}>
        {/* Kode + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #E5E7EB' }}>
          <div>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: '0 0 4px', letterSpacing: '0.02em' }}>
              {data.kode}
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
              ID Transaksi Peminjaman
            </p>
          </div>
          <Badge status={data.status} />
        </div>

        {/* Grid info tanggal */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: terlambat ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
          gap: '24px',
        }}>
          <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
              Tanggal Pinjam
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {data.tanggalPinjam}
            </p>
          </div>

          <div>
            <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
              Tanggal Jatuh Tempo
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {data.jatuhTempo}
            </p>
          </div>

          {/* Kolom tambahan — hanya muncul kalau Terlambat */}
          {terlambat && (
            <>
              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
                  Hari Terlambat
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#DC2626', margin: 0 }}>
                  {data.hariTerlambat} hari
                </p>
              </div>

              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
                  Total Denda
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#DC2626', margin: 0 }}>
                  Rp {totalDenda.toLocaleString('id-ID')}
                </p>
              </div>
            </>
          )}

          {/* Kalau tidak terlambat, tetap tampil tapi isi "-" */}
          {!terlambat && (
            <>
              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
                  Hari Terlambat
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#6B7280', margin: 0 }}>—</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: '#9CA3AF', margin: '0 0 6px', fontWeight: 500 }}>
                  Total Denda
                </p>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#6B7280', margin: 0 }}>—</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buku yang dipinjam */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
          Buku yang Dipinjam
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {data.buku.map((buku, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}>
              <div style={{
                width: '44px', height: '58px', flexShrink: 0,
                backgroundColor: buku.coverColor,
                borderRadius: '6px',
              }} />
              <div>
                <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: '0 0 4px' }}>
                  {buku.judul}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                  {buku.penulis}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E5E7EB', marginBottom: '28px' }} />

      {/* Tombol kembali */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          href="/member/peminjaman"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '12px 32px',
            border: '1px solid #D4891A',
            borderRadius: '8px',
            color: '#D4891A',
            fontSize: '14px', fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FEF3DC' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
          Kembali ke Peminjaman
        </Link>
      </div>
    </div>
  )
}