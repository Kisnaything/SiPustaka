'use client'

import { useState } from 'react'
import Link from 'next/link'

const MAKS_PINJAM = 3
const DURASI_HARI = 5

const dummyBuku = [
  { id: '1', judul: 'Bumi Manusia', penulis: 'Pramoedya Ananta Toer', kategori: 'Sastra', tahun: 2005, stok: 2, cover: null },
  { id: '2', judul: 'Laskar Pelangi', penulis: 'Andrea Hirata', kategori: 'Sastra', tahun: 2005, stok: 1, cover: null },
  { id: '3', judul: 'Hujan Bulan Juni', penulis: 'Sapardi Djoko Damono', kategori: 'Puisi', tahun: 1994, stok: 0, cover: null },
  { id: '4', judul: 'Supernova', penulis: 'Dee Lestari', kategori: 'Fiksi', tahun: 2001, stok: 3, cover: null },
  { id: '5', judul: 'Cantik Itu Luka', penulis: 'Eka Kurniawan', kategori: 'Sastra', tahun: 2002, stok: 2, cover: null },
  { id: '6', judul: 'Tetralogi Buru', penulis: 'Pramoedya Ananta Toer', kategori: 'Sastra', tahun: 1980, stok: 1, cover: null },
]

const kategoriList = ['Semua', 'Sastra', 'Fiksi', 'Puisi']
const tahunList = ['Semua', '1980–1999', '2000–2009', '2010–sekarang']

type Buku = typeof dummyBuku[0]

const coverColors = ['#C8B89A', '#6B7E8F', '#8FA68B', '#D4A574', '#7B9BB5', '#A8876B']

export default function KatalogPage() {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [tahun, setTahun] = useState('Semua')
  const [tersediaSaja, setTersediaSaja] = useState(false)
  const [keranjang, setKeranjang] = useState<Buku[]>([])
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false)
  const [showTahunDropdown, setShowTahunDropdown] = useState(false)

  const tambahKeKeranjang = (buku: Buku) => {
    if (keranjang.length >= MAKS_PINJAM) return
    if (keranjang.find((b) => b.id === buku.id)) return
    if (buku.stok === 0) return
    setKeranjang([...keranjang, buku])
  }

  const hapusDariKeranjang = (id: string) => {
    setKeranjang(keranjang.filter((b) => b.id !== id))
  }

  const sudahDiKeranjang = (id: string) => keranjang.some((b) => b.id === id)

  const bukuFiltered = dummyBuku.filter((b) => {
    const matchSearch =
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.penulis.toLowerCase().includes(search.toLowerCase())
    const matchKategori = kategori === 'Semua' || b.kategori === kategori
    const matchTersedia = !tersediaSaja || b.stok > 0
    const matchTahun =
      tahun === 'Semua' ||
      (tahun === '1980–1999' && b.tahun >= 1980 && b.tahun <= 1999) ||
      (tahun === '2000–2009' && b.tahun >= 2000 && b.tahun <= 2009) ||
      (tahun === '2010–sekarang' && b.tahun >= 2010)
    return matchSearch && matchKategori && matchTersedia && matchTahun
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>

      {/* Konten utama */}
      <div style={{ flex: 1, padding: '24px 28px', minWidth: 0 }}>

        <p style={{ fontSize: '14px', color: '#6B7280', marginBottom: '20px' }}>
          Katalog Buku
        </p>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <svg style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
            width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder="Cari judul, penulis, atau ISBN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%', padding: '10px 12px 10px 40px',
              border: '1px solid #E5E7EB', borderRadius: '8px',
              fontSize: '14px', color: '#111827', outline: 'none',
              boxSizing: 'border-box', fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
            onFocus={(e) => { e.target.style.borderColor = '#F5A623'; e.target.style.boxShadow = '0 0 0 3px rgba(245,166,35,0.15)' }}
            onBlur={(e) => { e.target.style.borderColor = '#E5E7EB'; e.target.style.boxShadow = 'none' }}
          />
        </div>

        {/* Filter bar */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', flexWrap: 'wrap', alignItems: 'center' }}>

          {/* Kategori dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowKategoriDropdown(!showKategoriDropdown); setShowTahunDropdown(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: '8px',
                backgroundColor: '#FFFFFF', fontSize: '14px', color: '#374151',
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {kategori === 'Semua' ? 'Kategori' : kategori}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {showKategoriDropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 10,
                backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
                borderRadius: '8px', marginTop: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: '140px',
              }}>
                {kategoriList.map((k) => (
                  <button key={k}
                    onClick={() => { setKategori(k); setShowKategoriDropdown(false) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', border: 'none',
                      backgroundColor: kategori === k ? '#FEF3DC' : 'transparent',
                      color: kategori === k ? '#D4891A' : '#374151',
                      fontSize: '14px', cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >{k}</button>
                ))}
              </div>
            )}
          </div>

          {/* Tahun Terbit dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowTahunDropdown(!showTahunDropdown); setShowKategoriDropdown(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 14px', border: '1px solid #E5E7EB', borderRadius: '8px',
                backgroundColor: '#FFFFFF', fontSize: '14px', color: '#374151',
                cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif",
              }}
            >
              {tahun === 'Semua' ? 'Tahun Terbit' : tahun}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2">
                <path d="m6 9 6 6 6-6"/>
              </svg>
            </button>
            {showTahunDropdown && (
              <div style={{
                position: 'absolute', top: '100%', left: 0, zIndex: 10,
                backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB',
                borderRadius: '8px', marginTop: '4px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)', minWidth: '160px',
              }}>
                {tahunList.map((t) => (
                  <button key={t}
                    onClick={() => { setTahun(t); setShowTahunDropdown(false) }}
                    style={{
                      display: 'block', width: '100%', textAlign: 'left',
                      padding: '10px 14px', border: 'none',
                      backgroundColor: tahun === t ? '#FEF3DC' : 'transparent',
                      color: tahun === t ? '#D4891A' : '#374151',
                      fontSize: '14px', cursor: 'pointer',
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                    }}
                  >{t}</button>
                ))}
              </div>
            )}
          </div>

          {/* Tersedia Saja */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#374151' }}>
            <input
              type="checkbox" checked={tersediaSaja}
              onChange={(e) => setTersediaSaja(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#F5A623', cursor: 'pointer' }}
            />
            Tersedia Saja
          </label>
        </div>

        {/* Grid buku */}
        {bukuFiltered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px 0', color: '#6B7280' }}>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#374151', margin: '0 0 8px' }}>Buku tidak ditemukan</p>
            <p style={{ fontSize: '14px', margin: 0 }}>Coba kata kunci atau filter yang berbeda</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {bukuFiltered.map((buku, i) => {
              const habis = buku.stok === 0
              const diKeranjang = sudahDiKeranjang(buku.id)
              const keranjangPenuh = keranjang.length >= MAKS_PINJAM

              return (
                // ↓ KARTU = Link ke detail buku, TIDAK ada onClick tambah keranjang di sini
                <Link
                  key={buku.id}
                  href={`/member/katalog/${buku.id}`}
                  style={{
                    textDecoration: 'none',
                    display: 'block',
                    backgroundColor: '#FFFFFF',
                    border: diKeranjang ? '2px solid #F5A623' : '1px solid #E5E7EB',
                    borderRadius: '12px',
                    overflow: 'hidden',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    opacity: habis ? 0.5 : 1,
                    pointerEvents: habis ? 'none' : 'auto',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)' }}
                >
                  {/* Cover buku */}
                  <div style={{
                    width: '100%', aspectRatio: '3/4',
                    backgroundColor: coverColors[i % coverColors.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {buku.cover ? (
                      <img src={buku.cover} alt={buku.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Cover</span>
                    )}

                    {/* Badge stok habis */}
                    {habis && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        backgroundColor: '#DC2626', color: '#FFFFFF',
                        fontSize: '11px', fontWeight: 600,
                        padding: '3px 8px', borderRadius: '999px',
                      }}>Habis</div>
                    )}
                  </div>

                  {/* Info buku + tombol tambah keranjang */}
                  <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
                        {buku.judul}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                        {buku.penulis}
                      </p>
                    </div>

                    {/* ↓ BADGE TAMBAH KERANJANG — onClick ada di sini, bukan di kartu */}
                    {!habis && (
                      <button
                        onClick={(e) => {
                          e.preventDefault()    // ← cegah Link navigasi
                          e.stopPropagation()   // ← cegah event naik ke Link
                          tambahKeKeranjang(buku)
                        }}
                        style={{
                          flexShrink: 0, marginLeft: '8px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '999px', border: 'none',
                          cursor: keranjangPenuh && !diKeranjang ? 'not-allowed' : 'pointer',
                          fontSize: '12px', fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          backgroundColor: diKeranjang ? '#DCFCE7' : '#FEF3DC',
                          color: diKeranjang ? '#15803D' : '#D4891A',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {diKeranjang ? '✓ Dipilih' : '+ Tambah'}
                      </button>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Panel Keranjang */}
      <div style={{
        width: '280px', flexShrink: 0,
        borderLeft: '1px solid #E5E7EB', backgroundColor: '#FFFFFF',
        padding: '24px 20px', position: 'sticky', top: 0,
        height: '100vh', overflowY: 'auto',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0 }}>Keranjang</h2>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#D4891A' }}>{keranjang.length} Buku</span>
        </div>

        <div style={{
          backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE',
          borderRadius: '8px', padding: '10px 12px',
          display: 'flex', gap: '8px', alignItems: 'flex-start',
          marginBottom: '16px', fontSize: '13px', color: '#1D4ED8',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
          </svg>
          Maksimal peminjaman {MAKS_PINJAM} buku sekaligus.
        </div>

        <div style={{ flex: 1 }}>
          {keranjang.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>
                Belum ada buku dipilih.<br />Klik "+ Tambah" untuk menambahkan.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {keranjang.map((buku) => (
                <div key={buku.id} style={{
                  display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '10px', border: '1px solid #E5E7EB', borderRadius: '8px',
                }}>
                  <div style={{
                    width: '36px', height: '48px', flexShrink: 0,
                    backgroundColor: coverColors[dummyBuku.findIndex(b => b.id === buku.id) % coverColors.length],
                    borderRadius: '4px',
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {buku.judul}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6B7280', margin: '2px 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {buku.penulis}
                    </p>
                  </div>
                  <button
                    onClick={() => hapusDariKeranjang(buku.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#9CA3AF', padding: '4px', flexShrink: 0,
                      display: 'flex', alignItems: 'center',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6 6 18M6 6l12 12"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ marginTop: '24px', borderTop: '1px solid #E5E7EB', paddingTop: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>Pengembalian</span>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#111827' }}>+{DURASI_HARI} Hari</span>
          </div>
          <button
            disabled={keranjang.length === 0}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: keranjang.length === 0 ? '#E5E7EB' : '#F5A623',
              color: keranjang.length === 0 ? '#9CA3AF' : '#FFFFFF',
              border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              cursor: keranjang.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'background-color 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5"/>
            </svg>
            Ajukan Peminjaman
          </button>
        </div>
      </div>
    </div>
  )
}