'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { useBukuById } from '@/lib/hooks/useBuku'
import { getPeminjamanByAnggota } from '@/lib/data/peminjaman'

const CART_KEY = 'sipustaka_cart'

const coverColors = ['#C8B89A', '#6B7E8F', '#8FA68B', '#D4A574', '#7B9BB5', '#A8876B']

type Buku = {
  id: string
  judul: string
  penulis: string
  kategori: string
  tahun: number
  stok: number
  cover: string | null
  preview: string | null
  sinopsis: string
  penerbit: string
  cetakan: string
  isbn: string
}

function getCart(): Buku[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || '[]')
  } catch {
    return []
  }
}

function saveCart(items: Buku[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(items))
}

export default function DetailBukuPage() {
  const params = useParams()
  const id = params.id as string
  const { book: buku, loading } = useBukuById(id)

  const [ditambahkan, setDitambahkan] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [terblokir, setTerblokir] = useState(false)
  const [pesanBlokir, setPesanBlokir] = useState('')

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (user) {
        const list = await getPeminjamanByAnggota(user.id)
        const now = new Date()
        const overdue = list.filter(
          (p) => p.status === 'Aktif' && p.jatuh_tempo && new Date(p.jatuh_tempo) < now
        )
        if (overdue.length > 0) {
          setTerblokir(true)
          setPesanBlokir(
            `Kamu memiliki ${overdue.length} buku yang telat dikembalikan. Selesaikan pengembalian dan denda terlebih dahulu.`
          )
        }
      }
    })
  }, [])

  if (loading) {
    return <div style={{ padding: '48px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <p style={{ fontSize: '16px', color: '#6B7280' }}>Loading...</p>
    </div>
  }

  if (!buku) {
    return (
      <div style={{ padding: '48px', textAlign: 'center', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        <p style={{ fontSize: '16px', color: '#6B7280' }}>Buku tidak ditemukan.</p>
        <Link href="/member/katalog" style={{ color: '#F5A623', fontSize: '14px' }}>← Kembali ke Katalog</Link>
      </div>
    )
  }

  const habis = buku.stok === 0
  const colorIndex = parseInt(buku.id) % coverColors.length

  return (
    <div style={{ padding: '24px 32px', fontFamily: "'Plus Jakarta Sans', sans-serif", maxWidth: '1280px' }}>

      {/* ─── Modal Preview PDF ─── */}
      {showPreview && buku.preview && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setShowPreview(false)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '900px',
              height: '80vh',
              overflow: 'hidden',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 20px',
                borderBottom: '1px solid #E5E7EB',
                backgroundColor: '#F9FAFB',
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '14px' }}>
                Preview: {buku.judul}
              </span>
              <button
                onClick={() => setShowPreview(false)}
                style={{
                  padding: '4px 8px',
                  border: 'none',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </button>
            </div>
            <div style={{ height: 'calc(100% - 56px)', padding: '16px' }}>
              <object
                data={buku.preview}
                type="application/pdf"
                style={{ width: '100%', height: '100%', borderRadius: '8px' }}
              >
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <p>Browser tidak mendukung preview PDF.</p>
                  <a
                    href={buku.preview}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: '#F5A623', textDecoration: 'underline' }}
                  >
                    Download PDF
                  </a>
                </div>
              </object>
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px', fontSize: '14px' }}>
        <Link href="/member" style={{ color: '#6B7280', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Beranda
        </Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        <Link href="/member/katalog" style={{ color: '#6B7280', textDecoration: 'none' }}>Katalog Buku</Link>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
        <span style={{ color: '#111827', fontWeight: 500 }}>Detail Buku</span>
      </div>

      {/* Konten utama */}
      <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>

        {/* Kolom kiri — Cover + tombol */}
        <div style={{ flexShrink: 0, width: '280px' }}>
          {/* Cover */}
          <div style={{
            width: '100%',
            aspectRatio: '3/4',
            backgroundColor: buku.cover ? undefined : coverColors[colorIndex % coverColors.length],
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
          }}>
            {buku.cover ? (
              <img src={buku.cover} alt={buku.judul} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)' }}>Cover</span>
            )}
          </div>

          {/* Tombol Preview */}
          {buku.preview && (
            <button
              onClick={() => setShowPreview(true)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FEF3DC',
                color: '#B45309',
                border: '1px solid #F5A623',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginBottom: '10px',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#FDE68A' }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FEF3DC' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
              </svg>
              Preview Buku
            </button>
          )}

          {/* Tombol Tambah ke Keranjang */}
          <button
            disabled={habis || ditambahkan || terblokir}
            onClick={() => {
              if (buku) {
                const cart = getCart()
                if (cart.length >= 3) {
                  alert('Maksimal 3 buku dalam keranjang.')
                  return
                }
                if (cart.find((b) => b.id === buku.id)) return
                saveCart([...cart, buku as Buku])
                setDitambahkan(true)
              }
            }}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: habis ? '#E5E7EB' : ditambahkan ? '#DCFCE7' : terblokir ? '#F3F4F6' : '#F5A623',
              color: habis ? '#9CA3AF' : ditambahkan ? '#15803D' : terblokir ? '#9CA3AF' : '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: habis || ditambahkan || terblokir ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              transition: 'all 0.15s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {habis
                ? <></>
                : ditambahkan
                  ? <path d="M20 6 9 17l-5-5"/>
                  : <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></>
              }
            </svg>
            {habis ? 'Stok Habis' : ditambahkan ? '✓ Ditambahkan' : terblokir ? 'Diblokir' : 'Tambah ke Keranjang'}
          </button>
          {terblokir && (
            <div style={{
              backgroundColor: '#FEE2E2', border: '1px solid #FECACA',
              borderRadius: '8px', padding: '10px 12px',
              marginBottom: '10px', fontSize: '12px', color: '#DC2626',
              lineHeight: 1.5,
            }}>
              {pesanBlokir}
            </div>
          )}

          {/* Tombol Kembali ke Katalog */}
          <Link
            href="/member/katalog"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#374151',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxSizing: 'border-box',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
            Kembali ke Katalog
          </Link>
        </div>

        {/* Kolom kanan — Info buku */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* Badge kategori */}
          <span style={{
            display: 'inline-block',
            backgroundColor: '#FEF3DC',
            color: '#D4891A',
            fontSize: '12px',
            fontWeight: 500,
            padding: '4px 12px',
            borderRadius: '999px',
            marginBottom: '12px',
          }}>
            {buku.kategori}
          </span>

          {/* Judul */}
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            color: '#111827',
            margin: '0 0 10px',
            lineHeight: 1.2,
          }}>
            {buku.judul}
          </h1>

          {/* Penulis */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '28px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
            </svg>
            <span style={{ fontSize: '14px', color: '#6B7280' }}>{buku.penulis}</span>
          </div>

          {/* Info grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '1px',
            backgroundColor: '#E5E7EB',
            border: '1px solid #E5E7EB',
            borderRadius: '12px',
            overflow: 'hidden',
            marginBottom: '32px',
          }}>
            {[
              { label: 'PENERBIT', value: buku.penerbit },
              { label: 'TAHUN TERBIT', value: buku.tahun },
              { label: 'CETAKAN', value: buku.cetakan || 'Ke-1' },
              { label: 'ISBN', value: buku.isbn },
            ].map((item) => (
              <div key={item.label} style={{ backgroundColor: '#FFFFFF', padding: '16px 18px' }}>
                <p style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', margin: '0 0 6px', letterSpacing: '0.06em' }}>
                  {item.label}
                </p>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#111827', margin: 0, lineHeight: 1.3 }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Sinopsis */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <svg width="18" height="18" viewBox="0 0 22 16" fill="none">
                <path d="M13 5.9V4.2C13.55 3.96667 14.1125 3.79167 14.6875 3.675C15.2625 3.55833 15.8667 3.5 16.5 3.5C16.9333 3.5 17.3583 3.53333 17.775 3.6C18.1917 3.66667 18.6 3.75 19 3.85V5.45C18.6 5.3 18.1958 5.1875 17.7875 5.1125C17.3792 5.0375 16.95 5 16.5 5C15.8667 5 15.2583 5.07917 14.675 5.2375C14.0917 5.39583 13.5333 5.61667 13 5.9ZM13 11.4V9.7C13.55 9.46667 14.1125 9.29167 14.6875 9.175C15.2625 9.05833 15.8667 9 16.5 9C16.9333 9 17.3583 9.03333 17.775 9.1C18.1917 9.16667 18.6 9.25 19 9.35V10.95C18.6 10.8 18.1958 10.6875 17.7875 10.6125C17.3792 10.5375 16.95 10.5 16.5 10.5C15.8667 10.5 15.2583 10.575 14.675 10.725C14.0917 10.875 13.5333 11.1 13 11.4ZM5.5 12C6.28333 12 7.04583 12.0875 7.7875 12.2625C8.52917 12.4375 9.26667 12.7 10 13.05V3.2C9.31667 2.8 8.59167 2.5 7.825 2.3C7.05833 2.1 6.28333 2 5.5 2C4.9 2 4.30417 2.05833 3.7125 2.175C3.12083 2.29167 2.55 2.46667 2 2.7V12.6C2.58333 12.4 3.1625 12.25 3.7375 12.15C4.3125 12.05 4.9 12 5.5 12ZM12 13.05C12.7333 12.7 13.4708 12.4375 14.2125 12.2625C14.9542 12.0875 15.7167 12 16.5 12C17.1 12 17.6875 12.05 18.2625 12.15C18.8375 12.25 19.4167 12.4 20 12.6V2.7C19.45 2.46667 18.8792 2.29167 18.2875 2.175C17.6958 2.05833 17.1 2 16.5 2C15.7167 2 14.9417 2.1 14.175 2.3C13.4083 2.5 12.6833 2.8 12 3.2V13.05ZM11 16C10.2 15.3667 9.33333 14.875 8.4 14.525C7.46667 14.175 6.5 14 5.5 14C4.8 14 4.1125 14.0917 3.4375 14.275C2.7625 14.4583 2.11667 14.7167 1.5 15.05C1.15 15.2333 0.8125 15.225 0.4875 15.025C0.1625 14.825 0 14.5333 0 14.15V2.1C0 1.91667 0.0458333 1.74167 0.1375 1.575C0.229167 1.40833 0.366667 1.28333 0.55 1.2C1.31667 0.8 2.11667 0.5 2.95 0.3C3.78333 0.1 4.63333 0 5.5 0C6.46667 0 7.4125 0.125 8.3375 0.375C9.2625 0.625 10.15 1 11 1.5C11.85 1 12.7375 0.625 13.6625 0.375C14.5875 0.125 15.5333 0 16.5 0C17.3667 0 18.2167 0.1 19.05 0.3C19.8833 0.5 20.6833 0.8 21.45 1.2C21.6333 1.28333 21.7708 1.40833 21.8625 1.575C21.9542 1.74167 22 1.91667 22 2.1V14.15C22 14.5333 21.8375 14.825 21.5125 15.025C21.1875 15.225 20.85 15.2333 20.5 15.05C19.8833 14.7167 19.2375 14.4583 18.5625 14.275C17.8875 14.0917 17.2 14 16.5 14C15.5 14 14.5333 14.175 13.6 14.525C12.6667 14.875 11.8 15.3667 11 16Z" fill="#D4891A"/>
              </svg>
              <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#111827', margin: 0 }}>Sinopsis</h2>
            </div>

            {buku.sinopsis.split('\n\n').map((paragraf, i) => (
              <p key={i} style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: 1.7,
                margin: i === 0 ? '0 0 14px' : '0',
              }}>
                {paragraf}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}