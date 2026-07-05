'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';

const tabs = ['Semua', 'Aktif', 'Menunggu Verifikasi', 'Selesai', 'Terlambat'];

const statusStyle: Record<string, { bg: string; color: string }> = {
  'Aktif': { bg: '#DCFCE7', color: '#15803D' },
  'Menunggu Verifikasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Terlambat': { bg: '#FEE2E2', color: '#DC2626' },
  'Selesai': { bg: '#F3F4F6', color: '#6B7280' },
};

// Map status dari store ke label yang ditampilkan
const statusMap: Record<string, string> = {
  'Menunggu Konfirmasi': 'Menunggu Verifikasi',
  'Aktif': 'Aktif',
  'Selesai': 'Selesai',
  'Dibatalkan': 'Dibatalkan',
};

function Badge({ status }: { status: string }) {
  const displayStatus = statusMap[status] || status;
  const style = statusStyle[displayStatus] ?? { bg: '#F3F4F6', color: '#6B7280' };
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        backgroundColor: style.bg,
        color: style.color,
        borderRadius: '999px',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 500,
        whiteSpace: 'nowrap',
      }}
    >
      {displayStatus}
    </span>
  );
}

const coverColors = ['#C8B89A', '#6B7E8F', '#8FA68B', '#D4A574', '#7B9BB5', '#A8876B'];

export default function PeminjamanPage() {
  const allPeminjaman = usePeminjaman();
  const [activeTab, setActiveTab] = useState('Semua');
  const [search, setSearch] = useState('');

  const filtered = allPeminjaman.filter((p) => {
    const displayStatus = statusMap[p.status] || p.status;
    const matchTab =
      activeTab === 'Semua' ||
      (activeTab === 'Terlambat' && p.status === 'Aktif' && p.jatuh_tempo && new Date(p.jatuh_tempo) < new Date()) ||
      displayStatus === activeTab;

    const matchSearch =
      p.kode_peminjaman.toLowerCase().includes(search.toLowerCase()) ||
      p.buku_judul.toLowerCase().includes(search.toLowerCase()) ||
      p.anggota_nama.toLowerCase().includes(search.toLowerCase());

    return matchTab && matchSearch;
  });

  return (
    <div
      style={{
        padding: '32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '1280px',
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: '28px' }}>
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 6px',
          }}
        >
          Peminjaman Saya
        </h1>
        <p style={{ fontSize: '14px', color: '#6B7280', margin: 0 }}>
          Kelola dan pantau status buku yang sedang Anda pinjam.
        </p>
      </div>

      {/* Tabs + Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0',
          borderBottom: '1px solid #E5E7EB',
        }}
      >
        <div style={{ display: 'flex', gap: '0' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 16px',
                border: 'none',
                borderBottom:
                  activeTab === tab ? '2px solid #F5A623' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? '#F5A623' : '#6B7280',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.15s ease',
                marginBottom: '-1px',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ position: 'relative', marginBottom: '1px' }}>
          <svg
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#9CA3AF"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Cari peminjaman..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: '8px 12px 8px 34px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              color: '#111827',
              outline: 'none',
              width: '220px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = '#F5A623';
              e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = '#E5E7EB';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>

      {/* Tabel */}
      <div
        style={{
          border: '1px solid #E5E7EB',
          borderTop: 'none',
          borderRadius: '0 0 12px 12px',
          overflow: 'hidden',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        {/* Header tabel */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr 140px 140px 160px 80px',
            backgroundColor: '#F9FAFB',
            padding: '12px 20px',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {['No. Peminjaman', 'Buku', 'Tanggal Pinjam', 'Jatuh Tempo', 'Status', 'Aksi'].map(
            (h) => (
              <span
                key={h}
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#374151',
                  letterSpacing: '0.02em',
                }}
              >
                {h}
              </span>
            )
          )}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
            <p
              style={{
                fontSize: '14px',
                margin: '0 0 8px',
                fontWeight: 600,
                color: '#374151',
              }}
            >
              Tidak ada peminjaman ditemukan
            </p>
            <p style={{ fontSize: '13px', margin: 0 }}>
              {activeTab === 'Semua'
                ? 'Belum ada peminjaman. Pilih buku di Katalog untuk mulai.'
                : `Tidak ada peminjaman dengan status "${activeTab}".`}
            </p>
          </div>
        ) : (
          filtered.map((item) => {
            const displayStatus = statusMap[item.status] || item.status;
            const isTerlambat =
              item.status === 'Aktif' &&
              item.jatuh_tempo &&
              new Date(item.jatuh_tempo) < new Date();

            const statusToShow = isTerlambat ? 'Terlambat' : displayStatus;

            return (
              <div
                key={item.kode_peminjaman} // ← PASTIKAN PAKAI KODE, BUKAN ID
                style={{
                  display: 'grid',
                  gridTemplateColumns: '180px 1fr 140px 140px 160px 80px',
                  padding: '16px 20px',
                  borderBottom:
                    filtered.indexOf(item) < filtered.length - 1 ? '1px solid #E5E7EB' : 'none',
                  alignItems: 'center',
                  transition: 'background-color 0.15s',
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = '#FFFBF0')
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = 'transparent')
                }
              >
                {/* No. Peminjaman */}
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#374151',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  {item.kode_peminjaman}
                </span>

                {/* Buku */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '48px',
                      flexShrink: 0,
                      backgroundColor: coverColors[parseInt(item.id) % coverColors.length],
                      borderRadius: '4px',
                    }}
                  />
                  <div>
                    <span
                      style={{
                        fontSize: '14px',
                        fontWeight: 500,
                        color: '#111827',
                        display: 'block',
                        maxWidth: '160px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.buku_judul}
                    </span>
                  </div>
                </div>

                {/* Tanggal Pinjam */}
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {item.tanggal_pinjam
                    ? new Date(item.tanggal_pinjam).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>

                {/* Jatuh Tempo */}
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {item.jatuh_tempo
                    ? new Date(item.jatuh_tempo).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '-'}
                </span>

                {/* Status */}
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Badge status={statusToShow} />
                </div>

                {/* Aksi */}
                <Link
                  href={`/member/peminjaman/${item.id}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#D4891A',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.textDecoration = 'underline')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.textDecoration = 'none')
                  }
                >
                  Detail
                </Link>
              </div>
            );
          })
        )}

        {/* Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center',
            padding: '12px 20px',
            borderTop: filtered.length > 0 ? '1px solid #E5E7EB' : 'none',
            gap: '4px',
          }}
        >
          <button
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            style={{
              width: '28px',
              height: '28px',
              border: '1px solid #E5E7EB',
              borderRadius: '6px',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#6B7280',
            }}
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}