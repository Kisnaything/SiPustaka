'use client';

import { useState, useRef, useEffect } from 'react';
import { usePeminjaman } from '@/lib/hooks/usePeminjaman';
import { updatePeminjaman } from '@/lib/data/peminjaman'; // nanti kita buat fungsi ini

const tabs = ['Semua', 'Belum Lunas', 'Menunggu Verifikasi', 'Lunas', 'Ditolak'];

const statusStyle: Record<string, { bg: string; color: string }> = {
  'Belum Lunas': { bg: '#FEE2E2', color: '#DC2626' },
  'Menunggu Verifikasi': { bg: '#FEF9C3', color: '#854D0E' },
  'Lunas': { bg: '#DCFCE7', color: '#15803D' },
  'Ditolak': { bg: '#FEE2E2', color: '#DC2626' },
};

function Badge({ status }: { status: string }) {
  const style = statusStyle[status] ?? { bg: '#F3F4F6', color: '#6B7280' };
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
      {status}
    </span>
  );
}

const coverColors = ['#374151', '#0E7490', '#C8B89A', '#8FA68B', '#D4A574'];

export default function DendaPage() {
  const allPeminjaman = usePeminjaman();
  const [activeTab, setActiveTab] = useState('Semua');
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File | null>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  // Filter peminjaman yang sudah selesai dan punya denda > 0
  const dendaList = allPeminjaman
    .filter((p) => p.status === 'Selesai' && p.denda > 0)
    .map((p) => ({
      id: p.id,
      judul: p.buku_judul,
      coverColor: coverColors[parseInt(p.id) % coverColors.length],
      hariTerlambat: p.hariTerlambat || 0,
      jumlahDenda: p.denda,
      tanggal: p.tanggal_pinjam
        ? new Date(p.tanggal_pinjam).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        : '-',
      status: p.status_denda || 'Belum Lunas',
      pesanDitolak: p.pesan_ditolak || null,
    }));

  const filtered = dendaList.filter((d) => {
    if (activeTab === 'Semua') return true;
    return d.status === activeTab;
  });

  const totalBelumLunas = dendaList
    .filter((d) => d.status === 'Belum Lunas' || d.status === 'Ditolak')
    .reduce((sum, d) => sum + d.jumlahDenda, 0);

  const jumlahBelumLunas = dendaList.filter(
    (d) => d.status === 'Belum Lunas' || d.status === 'Ditolak'
  ).length;

  const handleUpload = (id: string) => {
    fileInputRefs.current[id]?.click();
  };

  const handleFileChange = (id: string, file: File | null) => {
    if (!file) return;
    setUploadedFiles((prev) => ({ ...prev, [id]: file }));
    // Nanti di sini kita upload ke Supabase Storage, dan update status_denda menjadi 'Menunggu Verifikasi'
    // Untuk sekarang, kita update status di store
    const updated = {
      status_denda: 'Menunggu Verifikasi' as const,
      pesan_ditolak: null,
    };
    // panggil fungsi update di store (nanti kita buat)
    // updatePeminjaman(id, updated);
    alert(`File "${file.name}" siap diupload untuk denda ID ${id}`);
  };

  return (
    <div
      style={{
        padding: '28px 32px',
        fontFamily: "'Plus Jakarta Sans', sans-serif",
        maxWidth: '1100px',
      }}
    >
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 20px' }}>
        Denda
      </h1>

      {jumlahBelumLunas > 0 && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FEFCE8',
            border: '1px solid #FDE047',
            borderRadius: '8px',
            padding: '14px 16px',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#854D0E',
            fontWeight: 500,
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#CA8A04"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ flexShrink: 0 }}
          >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
          Kamu memiliki {jumlahBelumLunas} denda belum lunas. Total:{' '}
          Rp {totalBelumLunas.toLocaleString('id-ID')}
        </div>
      )}

      <div
        style={{
          border: '1px solid #E5E7EB',
          borderRadius: '12px',
          backgroundColor: '#FFFFFF',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', borderBottom: '1px solid #E5E7EB', padding: '0 16px' }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '12px 14px',
                border: 'none',
                borderBottom: activeTab === tab ? '2px solid #F5A623' : '2px solid transparent',
                backgroundColor: 'transparent',
                fontSize: '14px',
                fontWeight: activeTab === tab ? 600 : 400,
                color: activeTab === tab ? '#F5A623' : '#6B7280',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                marginBottom: '-1px',
                transition: 'all 0.15s ease',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 130px 140px 120px 160px 140px',
            padding: '12px 20px',
            backgroundColor: '#F9FAFB',
            borderBottom: '1px solid #E5E7EB',
          }}
        >
          {['BUKU', 'HARI TERLAMBAT', 'JUMLAH DENDA', 'TANGGAL', 'STATUS', 'AKSI'].map((h) => (
            <span
              key={h}
              style={{
                fontSize: '12px',
                fontWeight: 500,
                color: '#374151',
                letterSpacing: '0.05em',
              }}
            >
              {h}
            </span>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#6B7280' }}>
            <p style={{ fontSize: '14px', margin: 0 }}>
              Tidak ada denda dengan status "{activeTab}".
            </p>
          </div>
        ) : (
          filtered.map((item, i) => {
            const belumLunas = item.status === 'Belum Lunas';
            const ditolak = item.status === 'Ditolak';
            const perluUpload = belumLunas || ditolak;

            return (
              <div key={item.id}>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 130px 140px 120px 160px 140px',
                    padding: '16px 20px',
                    borderBottom:
                      i < filtered.length - 1 && !item.pesanDitolak
                        ? '1px solid #E5E7EB'
                        : 'none',
                    alignItems: 'center',
                    borderLeft: belumLunas ? '3px solid #DC2626' : '3px solid transparent',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#FFFBF0')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = 'transparent')
                  }
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '48px',
                        flexShrink: 0,
                        backgroundColor: item.coverColor,
                        borderRadius: '4px',
                      }}
                    />
                    <span style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                      {item.judul}
                    </span>
                  </div>

                  <span style={{ fontSize: '14px', color: '#374151' }}>
                    {item.hariTerlambat} hari
                  </span>

                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#DC2626' }}>
                    Rp {item.jumlahDenda.toLocaleString('id-ID')}
                  </span>

                  <span style={{ fontSize: '14px', color: '#6B7280' }}>{item.tanggal}</span>

                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Badge status={item.status} />
                  </div>

                  <div>
                    {perluUpload ? (
                      <>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          ref={(el) => {
                            fileInputRefs.current[item.id] = el;
                          }}
                          onChange={(e) =>
                            handleFileChange(item.id, e.target.files?.[0] ?? null)
                          }
                          style={{ display: 'none' }}
                        />
                        <button
                          onClick={() => handleUpload(item.id)}
                          style={{
                            padding: '8px 16px',
                            backgroundColor: '#F5A623',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '13px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: "'Plus Jakarta Sans', sans-serif",
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Upload Bukti
                        </button>
                        {uploadedFiles[item.id] && (
                          <p style={{ fontSize: '11px', color: '#16A34A', margin: '4px 0 0' }}>
                            ✓ {uploadedFiles[item.id]?.name}
                          </p>
                        )}
                      </>
                    ) : (
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: 500,
                          color: '#D4891A',
                          cursor: 'pointer',
                        }}
                      >
                        Detail
                      </span>
                    )}
                  </div>
                </div>

                {ditolak && item.pesanDitolak && (
                  <div
                    style={{
                      padding: '8px 20px 14px',
                      borderBottom:
                        i < filtered.length - 1 ? '1px solid #E5E7EB' : 'none',
                      borderLeft: '3px solid transparent',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#DC2626"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      <span style={{ fontSize: '13px', color: '#DC2626' }}>
                        {item.pesanDitolak}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}