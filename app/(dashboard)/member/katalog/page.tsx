'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase/client';
import { useBuku } from '@/lib/hooks/useBuku';
import { addPeminjaman, getPeminjamanByAnggota } from '@/lib/data/peminjaman';
import Pagination from '@/components/Pagination';

const MAKS_PINJAM = 3;
const DURASI_HARI = 5;

const CART_KEY = 'sipustaka_cart';

const kategoriList = ['Semua', 'Self Improvement', 'Romance', 'Fantasy', 'Thriller & Mystery', 'Young Adult (YA)', 'Business & Finance', 'Technology & Artificial Intelligence', 'Psychology', 'Productivity', 'Science Fiction (Sci-Fi)'];
const tahunList = ['Semua', '1980–1999', '2000–2009', '2010–sekarang'];

type Buku = {
  id: string;
  judul: string;
  penulis: string;
  kategori: string;
  tahun: number;
  stok: number;
  cover: string | null;
  preview: string | null;
  sinopsis: string;
  penerbit: string;
  cetakan: string;
  isbn: string;
};

function getCart(): Buku[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveCart(items: Buku[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

const coverColors = ['#C8B89A', '#6B7E8F', '#8FA68B', '#D4A574', '#7B9BB5', '#A8876B'];

export default function KatalogPage() {
  const { books } = useBuku();

  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [terblokir, setTerblokir] = useState(false);
  const [pesanBlokir, setPesanBlokir] = useState('');

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        setUserName(user.user_metadata?.nama_lengkap || 'Anggota');
        const list = await getPeminjamanByAnggota(user.id);
        const now = new Date();

        // Cek buku telat dikembalikan
        const overdue = list.filter(
          (p) => p.status === 'Aktif' && p.jatuh_tempo && new Date(p.jatuh_tempo) < now
        );

        // Cek denda belum lunas
        const dendaBelumLunas = list.filter(
          (p) => p.status === 'Selesai' && p.denda > 0 &&
            (p.status_denda === 'Belum Lunas' || p.status_denda === 'Menunggu Verifikasi' || p.status_denda === 'Ditolak')
        );

        if (overdue.length > 0) {
          setTerblokir(true);
          setPesanBlokir(
            `Kamu memiliki ${overdue.length} buku yang telat dikembalikan. Selesaikan pengembalian dan denda terlebih dahulu.`
          );
        } else if (dendaBelumLunas.length > 0) {
          setTerblokir(true);
          setPesanBlokir(
            `Kamu memiliki denda sebesar Rp ${dendaBelumLunas.reduce((s, p) => s + p.denda, 0).toLocaleString('id-ID')} yang belum dibayar. Selesaikan denda terlebih dahulu.`
          );
        }
      }
    });
  }, []);

  const [search, setSearch] = useState('');
  const [kategori, setKategori] = useState('Semua');
  const [tahun, setTahun] = useState('Semua');
  const [tersediaSaja, setTersediaSaja] = useState(false);
  const [keranjang, setKeranjang] = useState<Buku[]>(() => getCart());
  const [showKategoriDropdown, setShowKategoriDropdown] = useState(false);
  const [showTahunDropdown, setShowTahunDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const tambahKeKeranjang = (buku: Buku) => {
    if (keranjang.length >= MAKS_PINJAM) return;
    if (keranjang.find((b) => b.id === buku.id)) return;
    if (buku.stok === 0) return;
    const next = [...keranjang, buku];
    setKeranjang(next);
    saveCart(next);
  };

  const hapusDariKeranjang = (id: string) => {
    const next = keranjang.filter((b) => b.id !== id);
    setKeranjang(next);
    saveCart(next);
  };

  const sudahDiKeranjang = (id: string) => keranjang.some((b) => b.id === id);

  const bukuFiltered = books.filter((b) => {
    const matchSearch =
      b.judul.toLowerCase().includes(search.toLowerCase()) ||
      b.penulis.toLowerCase().includes(search.toLowerCase());
    const matchKategori = kategori === 'Semua' || b.kategori === kategori;
    const matchTersedia = !tersediaSaja || b.stok > 0;
    const matchTahun =
      tahun === 'Semua' ||
      (tahun === '1980–1999' && b.tahun >= 1980 && b.tahun <= 1999) ||
      (tahun === '2000–2009' && b.tahun >= 2000 && b.tahun <= 2009) ||
      (tahun === '2010–sekarang' && b.tahun >= 2010);
    return matchSearch && matchKategori && matchTersedia && matchTahun;
  });

  const totalPages = Math.ceil(bukuFiltered.length / ITEMS_PER_PAGE);
  const paginatedData = bukuFiltered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, kategori, tahun, tersediaSaja]);

  // ─── AJUKAN PEMINJAMAN ──────────────────────────────────────
  const handleAjukanPeminjaman = async () => {
    if (keranjang.length === 0) return;
    if (!userId) {
      alert('Silakan login terlebih dahulu');
      return;
    }

    const semua = await getPeminjamanByAnggota(userId);
    const peminjamanBerjalan = semua.filter(
      (p) => p.status === 'Aktif' || p.status === 'Menunggu Konfirmasi'
    );
    const sisaSlot = MAKS_PINJAM - peminjamanBerjalan.length;

    if (sisaSlot <= 0) {
      alert(`Kamu sudah memiliki ${peminjamanBerjalan.length} peminjaman aktif. Maksimal ${MAKS_PINJAM} peminjaman aktif per anggota.`);
      return;
    }

    if (keranjang.length > sisaSlot) {
      alert(`Kamu hanya bisa menambahkan ${sisaSlot} buku lagi (maksimal ${MAKS_PINJAM} peminjaman aktif).`);
      return;
    }

    let successCount = 0;

    for (const buku of keranjang) {
      const result = await addPeminjaman({
        anggota_id: userId,
        anggota_nama: userName,
        buku_id: buku.id,
        buku_judul: buku.judul,
      });
      if (result.success) {
        successCount++;
      } else {
        console.error('Gagal ajukan peminjaman:', result.message);
      }
    }

    if (successCount > 0) {
      setKeranjang([]);
      saveCart([]);
      alert(`${successCount} buku berhasil diajukan peminjaman!`);
    }
  };

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
            {paginatedData.map((buku, i) => {
              const habis = buku.stok === 0;
              const diKeranjang = sudahDiKeranjang(buku.id);
              const keranjangPenuh = keranjang.length >= MAKS_PINJAM;

              return (
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
                    backgroundColor: buku.cover ? undefined : coverColors[i % coverColors.length],
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative',
                  }}>
                    {buku.cover ? (
                      <img src={buku.cover} alt={buku.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>Cover</span>
                    )}

                    {habis && (
                      <div style={{
                        position: 'absolute', top: '10px', right: '10px',
                        backgroundColor: '#DC2626', color: '#FFFFFF',
                        fontSize: '11px', fontWeight: 600,
                        padding: '3px 8px', borderRadius: '999px',
                      }}>Habis</div>
                    )}
                  </div>

                  <div style={{ padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: '0 0 4px', lineHeight: 1.3 }}>
                        {buku.judul}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6B7280', margin: 0 }}>
                        {buku.penulis}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9CA3AF', margin: '4px 0 0' }}>
                        Stok: {buku.stok}
                      </p>
                    </div>

                    {!habis && (
                      <button
                        disabled={terblokir}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          if (terblokir) return;
                          tambahKeKeranjang(buku);
                        }}
                        style={{
                          flexShrink: 0, marginLeft: '8px',
                          display: 'inline-flex', alignItems: 'center', gap: '4px',
                          padding: '4px 10px', borderRadius: '999px', border: 'none',
                          cursor: (keranjangPenuh && !diKeranjang) || terblokir ? 'not-allowed' : 'pointer',
                          fontSize: '12px', fontWeight: 500,
                          fontFamily: "'Plus Jakarta Sans', sans-serif",
                          backgroundColor: diKeranjang ? '#DCFCE7' : terblokir ? '#F3F4F6' : '#FEF3DC',
                          color: diKeranjang ? '#15803D' : terblokir ? '#9CA3AF' : '#D4891A',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {diKeranjang ? '✓ Dipilih' : terblokir ? 'Diblokir' : '+ Tambah'}
                      </button>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={bukuFiltered.length}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* ─── Panel Keranjang ─── */}
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

        {terblokir ? (
          <div style={{
            backgroundColor: '#FEE2E2', border: '1px solid #FECACA',
            borderRadius: '8px', padding: '10px 12px',
            display: 'flex', gap: '8px', alignItems: 'flex-start',
            marginBottom: '16px', fontSize: '13px', color: '#DC2626',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}>
              <circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/>
            </svg>
            {pesanBlokir}
          </div>
        ) : (
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
        )}

        <div style={{ flex: 1 }}>
          {keranjang.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#9CA3AF' }}>
              <p style={{ fontSize: '13px', margin: 0 }}>
                Belum ada buku dipilih.<br />Klik &quot;+ Tambah&quot; untuk menambahkan.
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
                    backgroundColor: buku.cover ? undefined : coverColors[parseInt(buku.id) % coverColors.length],
                    borderRadius: '4px', overflow: 'hidden',
                  }}>
                    {buku.cover && (
                      <img src={buku.cover} alt={buku.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    )}
                  </div>
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
            onClick={handleAjukanPeminjaman}
            disabled={keranjang.length === 0 || terblokir}
            style={{
              width: '100%', padding: '12px',
              backgroundColor: keranjang.length === 0 || terblokir ? '#E5E7EB' : '#F5A623',
              color: keranjang.length === 0 || terblokir ? '#9CA3AF' : '#FFFFFF',
              border: 'none', borderRadius: '8px',
              fontSize: '14px', fontWeight: 600,
              cursor: keranjang.length === 0 || terblokir ? 'not-allowed' : 'pointer',
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
  );
}