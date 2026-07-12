'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { usePeminjamanById } from '@/lib/hooks/usePeminjaman';
import { usePengaturan } from '@/lib/hooks/usePengaturan';
import { useMobile } from '@/lib/hooks/useMobile';
import { supabase } from '@/lib/supabase/client';

const statusStyle: Record<string, { bg: string; color: string }> = {
  'Aktif': { bg: '#DCFCE7', color: '#15803D' },
  'Menunggu Konfirmasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Menunggu Verifikasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Terlambat': { bg: '#FEE2E2', color: '#DC2626' },
  'Selesai': { bg: '#F3F4F6', color: '#6B7280' },
  'Dibatalkan': { bg: '#FEE2E2', color: '#DC2626' },
};

const statusMap: Record<string, string> = {
  'Menunggu Konfirmasi': 'Menunggu Verifikasi',
  'Aktif': 'Aktif',
  'Selesai': 'Selesai',
  'Dibatalkan': 'Dibatalkan',
};

function Badge({ status }: { status: string }) {
  const displayStatus = statusMap[status] || status;
  const style = statusStyle[status] ?? statusStyle[displayStatus] ?? {
    bg: '#F3F4F6',
    color: '#6B7280',
  };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '999px',
        padding: '4px 12px',
        fontSize: '12px',
        fontWeight: 500,
      }}
    >
      {displayStatus}
    </span>
  );
}

const coverColors = ['#C8B89A', '#6B7E8F', '#8FA68B', '#D4A574', '#7B9BB5', '#A8876B'];

export default function DetailPeminjamanPage() {
  const params = useParams();
  const id = params.id as string;
  const { data, loading } = usePeminjamanById(id);
  const pengaturan = usePengaturan();
  const isMobile = useMobile();
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUserId(user.id);
    });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ color: '#6B7280' }}>Memuat data peminjaman...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <p style={{ color: '#6B7280' }}>Data peminjaman tidak ditemukan.</p>
        <Link href="/member/peminjaman" style={{ color: '#F5A623', fontSize: '14px' }}>
          ← Kembali ke Peminjaman
        </Link>
      </div>
    );
  }

  if (userId && data.anggota_id !== userId) {
    return (
      <div
        style={{
          padding: '48px',
          textAlign: 'center',
          fontFamily: "'Plus Jakarta Sans', sans-serif",
        }}
      >
        <p style={{ color: '#DC2626' }}>Akses ditolak. Ini bukan peminjaman Anda.</p>
        <Link href="/member/peminjaman" style={{ color: '#F5A623', fontSize: '14px' }}>
          ← Kembali ke Peminjaman
        </Link>
      </div>
    );
  }

  const displayStatus = statusMap[data.status] || data.status;
  const isTerlambat =
    data.status === 'Aktif' &&
    data.jatuh_tempo &&
    new Date(data.jatuh_tempo) < new Date();
  const statusToShow = isTerlambat ? 'Terlambat' : displayStatus;

  let totalDenda = 0;
  let hariTerlambat = 0;
  if (data.jatuh_tempo) {
    const jatuhTempo = new Date(data.jatuh_tempo);
    const now = new Date();
    if (now > jatuhTempo) {
      hariTerlambat = Math.ceil((now.getTime() - jatuhTempo.getTime()) / (1000 * 60 * 60 * 24));
      totalDenda = hariTerlambat * (pengaturan.denda_per_hari || 2000);
    }
  }

  return (
    <div
      style={{
        padding: isMobile ? '16px' : '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '900px',
        margin: '0 auto',
      }}
    >
      {/* Breadcrumb */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '28px',
          fontSize: '14px',
        }}
      >
        <Link
          href="/member/peminjaman"
          style={{ color: '#6B7280', textDecoration: 'none' }}
        >
          Peminjaman
        </Link>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#9CA3AF"
          strokeWidth="2"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span style={{ color: '#111827', fontWeight: 500 }}>Detail Peminjaman</span>
      </div>

      {/* Card info utama */}
      <div
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          padding: '24px',
          marginBottom: '28px',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '20px',
            paddingBottom: '20px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '20px',
                fontWeight: 700,
                color: '#111827',
                margin: '0 0 4px',
                letterSpacing: '0.02em',
              }}
            >
              {data.kode_peminjaman}
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
              ID Transaksi Peminjaman
            </p>
          </div>
          <Badge status={statusToShow} />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr 1fr' : isTerlambat ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)',
            gap: isMobile ? '16px' : '24px',
          }}
        >
          <div>
            <p
              style={{
                fontSize: '12px',
                color: '#9CA3AF',
                margin: '0 0 6px',
                fontWeight: 500,
              }}
            >
              Tanggal Pinjam
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {data.tanggal_pinjam
                ? new Date(data.tanggal_pinjam).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>

          <div>
            <p
              style={{
                fontSize: '12px',
                color: '#9CA3AF',
                margin: '0 0 6px',
                fontWeight: 500,
              }}
            >
              Tanggal Jatuh Tempo
            </p>
            <p style={{ fontSize: '15px', fontWeight: 600, color: '#111827', margin: 0 }}>
              {data.jatuh_tempo
                ? new Date(data.jatuh_tempo).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })
                : '-'}
            </p>
          </div>

          {isTerlambat && (
            <>
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: '0 0 6px',
                    fontWeight: 500,
                  }}
                >
                  Hari Terlambat
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#DC2626',
                    margin: 0,
                  }}
                >
                  {hariTerlambat} hari
                </p>
              </div>

              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: '0 0 6px',
                    fontWeight: 500,
                  }}
                >
                  Total Denda
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#DC2626',
                    margin: 0,
                  }}
                >
                  Rp {totalDenda.toLocaleString('id-ID')}
                </p>
              </div>
            </>
          )}

          {!isTerlambat && (
            <>
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: '0 0 6px',
                    fontWeight: 500,
                  }}
                >
                  Hari Terlambat
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#6B7280',
                    margin: 0,
                  }}
                >
                  —
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '12px',
                    color: '#9CA3AF',
                    margin: '0 0 6px',
                    fontWeight: 500,
                  }}
                >
                  Total Denda
                </p>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: 600,
                    color: '#6B7280',
                    margin: 0,
                  }}
                >
                  —
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Buku yang dipinjam */}
      <div style={{ marginBottom: '32px' }}>
        <h2
          style={{
            fontSize: '16px',
            fontWeight: 600,
            color: '#111827',
            margin: '0 0 16px',
          }}
        >
          Buku yang Dipinjam
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              border: '1px solid #E5E7EB',
              borderRadius: '12px',
              padding: '16px 20px',
              backgroundColor: '#FFFFFF',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            <div
              style={{
                width: '44px',
                height: '58px',
                flexShrink: 0,
                backgroundColor: coverColors[parseInt(data.id) % coverColors.length],
                borderRadius: '6px',
              }}
            />
            <div>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: '#111827',
                  margin: '0 0 4px',
                }}
              >
                {data.buku_judul}
              </p>
              <p style={{ fontSize: '13px', color: '#6B7280', margin: 0 }}>
                {data.anggota_nama} (Peminjam)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bukti Bayar Denda */}
      {data.status === 'Selesai' && data.denda > 0 && (
        <div style={{ marginBottom: '28px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#111827', margin: '0 0 16px' }}>
            Pembayaran Denda
          </h2>
          <div style={{
            border: '1px solid #E5E7EB', borderRadius: '12px', padding: '20px 24px',
            backgroundColor: '#FFFFFF', boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>Status Denda</span>
              <span style={{
                fontSize: '12px', fontWeight: 600, padding: '4px 12px', borderRadius: '999px',
                backgroundColor: data.status_denda === 'Lunas' ? '#DCFCE7' :
                  data.status_denda === 'Menunggu Verifikasi' ? '#FEF9C3' :
                  data.status_denda === 'Ditolak' ? '#FEE2E2' : '#FEE2E2',
                color: data.status_denda === 'Lunas' ? '#15803D' :
                  data.status_denda === 'Menunggu Verifikasi' ? '#854D0E' :
                  data.status_denda === 'Ditolak' ? '#DC2626' : '#DC2626',
              }}>
                {data.status_denda || 'Belum Lunas'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', color: '#6B7280' }}>Jumlah Denda</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#DC2626' }}>
                Rp {data.denda.toLocaleString('id-ID')}
              </span>
            </div>
            {data.bukti_bayar && (
              <div style={{ marginTop: '12px' }}>
                <span style={{ fontSize: '14px', color: '#6B7280', display: 'block', marginBottom: '8px' }}>
                  Bukti Pembayaran
                </span>
                <a href={data.bukti_bayar} target="_blank" rel="noopener noreferrer">
                  <img src={data.bukti_bayar} alt="Bukti Pembayaran" style={{
                    maxWidth: '100%', maxHeight: '300px', borderRadius: '8px',
                    border: '1px solid #E5E7EB', cursor: 'pointer',
                  }} />
                </a>
              </div>
            )}
            {data.pesan_ditolak && (
              <div style={{
                marginTop: '12px', padding: '10px 14px', backgroundColor: '#FEE2E2',
                borderRadius: '8px', fontSize: '13px', color: '#DC2626',
              }}>
                Alasan ditolak: {data.pesan_ditolak}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E5E7EB', marginBottom: '28px' }} />

      {/* Tombol kembali */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <Link
          href="/member/peminjaman"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            border: '1px solid #D4891A',
            borderRadius: '8px',
            color: '#D4891A',
            fontSize: '14px',
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEF3DC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Kembali ke Peminjaman
        </Link>
      </div>
    </div>
  );
}