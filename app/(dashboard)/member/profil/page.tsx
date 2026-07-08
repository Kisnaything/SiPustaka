'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

function getInisial(nama: string) {
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

function formatTanggal(iso: string) {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
}

function nomorAnggota(id: string) {
  return 'M-' + id.slice(0, 8).toUpperCase()
}

export default function ProfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    namaLengkap: '',
    alamat: '',
    noTelepon: '',
    email: '',
    username: '',
  })
  const [formTemp, setFormTemp] = useState(form)
  const [metadata, setMetadata] = useState({
    id: '',
    nomorAnggota: '',
    tanggalDaftar: '',
    status: 'Aktif',
  })

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const meta = user.user_metadata || {}
      const nama = meta.nama_lengkap || ''
      const alamat = meta.alamat || ''
      const telepon = meta.telepon || ''
      const username = meta.username || ''

      setForm({ namaLengkap: nama, alamat, noTelepon: telepon, email: user.email || '', username })
      setFormTemp({ namaLengkap: nama, alamat, noTelepon: telepon, email: user.email || '', username })
      setMetadata({
        id: user.id,
        nomorAnggota: nomorAnggota(user.id),
        tanggalDaftar: user.created_at ? formatTanggal(user.created_at) : '',
        status: 'Aktif',
      })
      setLoading(false)
    }
    load()
  }, [])

  const handleEdit = () => {
    setFormTemp(form)
    setIsEditing(true)
  }

  const handleSimpan = async () => {
    const { error } = await supabase.auth.updateUser({
      data: {
        nama_lengkap: formTemp.namaLengkap,
        alamat: formTemp.alamat,
        telepon: formTemp.noTelepon,
      },
    })

    if (error) {
      alert('Gagal menyimpan: ' + error.message)
      return
    }

    setForm(formTemp)
    setIsEditing(false)
  }

  const handleBatal = () => {
    setFormTemp(form)
    setIsEditing(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center', color: '#9CA3AF', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
        Memuat profil...
      </div>
    )
  }

  const inisial = getInisial(form.namaLengkap || 'A')

  return (
    <div style={{
      padding: '32px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: '700px',
      margin: '0 auto',
    }}>

      {/* Avatar + nama */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '72px', height: '72px',
          borderRadius: '50%',
          backgroundColor: '#FEF3DC',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 14px',
        }}>
          <span style={{ fontSize: '24px', fontWeight: 700, color: '#D4891A' }}>
            {inisial}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#111827' }}>
            {form.namaLengkap}
          </span>
          <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 400 }}>
            {metadata.nomorAnggota}
          </span>
          <span style={{
            backgroundColor: '#DCFCE7', color: '#15803D',
            borderRadius: '999px', padding: '3px 10px',
            fontSize: '12px', fontWeight: 500,
          }}>
            {metadata.status}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
          Anggota sejak {metadata.tanggalDaftar}
        </p>
      </div>

      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        marginBottom: '28px',
      }}>
        {[
          { label: 'TOTAL BUKU DIPINJAM', value: 0 },
          { label: 'TOTAL PEMINJAMAN', value: 0 },
          { label: 'TOTAL DENDA DIBAYAR', value: 'Rp 0' },
        ].map((stat) => (
          <div key={stat.label} style={{
            border: '1px solid #E5E7EB',
            borderRadius: '10px',
            padding: '16px',
            backgroundColor: '#FFFFFF',
          }}>
            <p style={{ fontSize: '11px', fontWeight: 500, color: '#9CA3AF', margin: '0 0 8px', letterSpacing: '0.05em' }}>
              {stat.label}
            </p>
            <p style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Card Informasi Pribadi */}
      <div style={{
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: '#FFFFFF',
        marginBottom: '12px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
      }}>
        {/* Header section */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '16px 20px',
          backgroundColor: '#FDF9F3',
          borderBottom: '1px solid #E5E7EB',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
            Informasi Pribadi
          </span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {isEditing && (
              <button
                onClick={handleBatal}
                style={{
                  padding: '6px 14px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#6B7280',
                  cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                }}
              >
                Batal
              </button>
            )}
            <button
              onClick={isEditing ? handleSimpan : handleEdit}
              style={{
                padding: '6px 14px',
                border: `1px solid ${isEditing ? '#F5A623' : '#F5A623'}`,
                borderRadius: '6px',
                backgroundColor: isEditing ? '#F5A623' : 'transparent',
                fontSize: '13px',
                fontWeight: 500,
                color: isEditing ? '#FFFFFF' : '#F5A623',
                cursor: 'pointer',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                transition: 'all 0.15s ease',
              }}
            >
              {isEditing ? 'Simpan' : 'Edit Profil'}
            </button>
          </div>
        </div>

        {/* Fields */}
        <div style={{ padding: '4px 0' }}>
          <FieldItem
            label="Nama Lengkap"
            value={formTemp.namaLengkap}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, namaLengkap: val })}
          />

          <FieldItem
            label="Nomor Anggota"
            value={metadata.nomorAnggota}
            isEditing={false}
            disabled
          />

          <FieldItem
            label="Alamat"
            value={formTemp.alamat}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, alamat: val })}
          />

          <FieldItem
            label="No. Telepon"
            value={formTemp.noTelepon}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, noTelepon: val })}
          />

          <FieldItem
            label="Email"
            value={formTemp.email}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, email: val })}
            isLast
          />
        </div>

        {/* Section Keamanan Akun */}
        <div style={{
          borderTop: '1px solid #E5E7EB',
          padding: '16px 20px 4px',
          backgroundColor: '#FDF9F3',
        }}>
          <span style={{ fontSize: '15px', fontWeight: 600, color: '#111827' }}>
            Keamanan Akun
          </span>
        </div>

        <div style={{ padding: '0 20px 20px' }}>
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Username
            </label>
            <input
              value={form.username}
              disabled
              style={{
                width: '100%',
                padding: '10px 12px',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#9CA3AF',
                backgroundColor: '#F9FAFB',
                boxSizing: 'border-box',
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                cursor: 'not-allowed',
              }}
            />
          </div>

          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Password
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input
                type="password"
                value="placeholder"
                disabled
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#9CA3AF',
                  backgroundColor: '#F9FAFB',
                  boxSizing: 'border-box',
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  cursor: 'not-allowed',
                }}
              />
              <Link
                href="/member/profil/ubah-password"
                style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  color: '#D4891A',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                Ubah Password
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Tombol Keluar */}
      <div style={{ textAlign: 'center', marginTop: '24px' }}>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 32px',
            backgroundColor: 'transparent',
            border: '1px solid #DC2626',
            borderRadius: '8px',
            color: '#DC2626',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#FEE2E2'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Keluar
        </button>
      </div>
    </div>
  )
}

function FieldItem({
  label,
  value,
  isEditing,
  onChange,
  disabled = false,
  isLast = false,
}: {
  label: string
  value: string
  isEditing: boolean
  onChange?: (val: string) => void
  disabled?: boolean
  isLast?: boolean
}) {
  return (
    <div style={{
      padding: '14px 20px',
      borderBottom: isLast ? 'none' : '1px solid #E5E7EB',
    }}>
      <label style={{
        fontSize: '13px', color: '#9CA3AF', fontWeight: 500,
        display: 'block', marginBottom: '6px',
      }}>
        {label}
      </label>
      {isEditing && !disabled ? (
        <input
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #F5A623',
            boxShadow: '0 0 0 3px rgba(245,166,35,0.15)',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#111827',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}
        />
      ) : (
        <p style={{
          fontSize: '14px',
          color: disabled ? '#9CA3AF' : '#111827',
          margin: 0,
          fontWeight: 400,
        }}>
          {value}
        </p>
      )}
    </div>
  )
}
