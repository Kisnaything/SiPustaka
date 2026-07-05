'use client'

import { useState } from 'react'
import Link from 'next/link'

const dataDummy = {
  namaLengkap: 'Sinta Maharani',
  nomorAnggota: 'A-20240041',
  alamat: 'Jl. Dharmawangsa No. 12, Surabaya',
  noTelepon: '0857-9012-3456',
  email: 'sinta.m@student.unair.ac.id',
  username: 'sinta.maharani',
  status: 'Aktif',
  tanggalDaftar: '3 Maret 2024',
  totalBukuDipinjam: 24,
  totalPeminjaman: 19,
  totalDendaDibayar: 45000,
}

function getInisial(nama: string) {
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function ProfilPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [form, setForm] = useState({
    namaLengkap: dataDummy.namaLengkap,
    alamat: dataDummy.alamat,
    noTelepon: dataDummy.noTelepon,
    email: dataDummy.email,
  })
  const [formTemp, setFormTemp] = useState(form)

  const handleEdit = () => {
    setFormTemp(form) // simpan state sebelum edit, untuk cancel
    setIsEditing(true)
  }

  const handleSimpan = () => {
    setForm(formTemp)
    setIsEditing(false)
    // nanti diganti dengan update ke Supabase
  }

  const handleBatal = () => {
    setFormTemp(form) // kembalikan ke sebelum edit
    setIsEditing(false)
  }

  const inisial = getInisial(form.namaLengkap)

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
            {dataDummy.nomorAnggota}
          </span>
          <span style={{
            backgroundColor: '#DCFCE7', color: '#15803D',
            borderRadius: '999px', padding: '3px 10px',
            fontSize: '12px', fontWeight: 500,
          }}>
            {dataDummy.status}
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
          Anggota sejak {dataDummy.tanggalDaftar}
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
          { label: 'TOTAL BUKU DIPINJAM', value: dataDummy.totalBukuDipinjam },
          { label: 'TOTAL PEMINJAMAN', value: dataDummy.totalPeminjaman },
          { label: 'TOTAL DENDA DIBAYAR', value: `Rp ${dataDummy.totalDendaDibayar.toLocaleString('id-ID')}` },
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
          {/* Nama Lengkap */}
          <FieldItem
            label="Nama Lengkap"
            value={formTemp.namaLengkap}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, namaLengkap: val })}
          />

          {/* Nomor Anggota — tidak bisa diedit */}
          <FieldItem
            label="Nomor Anggota"
            value={dataDummy.nomorAnggota}
            isEditing={false}
            disabled
          />

          {/* Alamat */}
          <FieldItem
            label="Alamat"
            value={formTemp.alamat}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, alamat: val })}
          />

          {/* No. Telepon */}
          <FieldItem
            label="No. Telepon"
            value={formTemp.noTelepon}
            isEditing={isEditing}
            onChange={(val) => setFormTemp({ ...formTemp, noTelepon: val })}
          />

          {/* Email */}
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
          {/* Username */}
          <div style={{ marginTop: '16px' }}>
            <label style={{ fontSize: '13px', color: '#9CA3AF', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
              Username
            </label>
            <input
              value={dataDummy.username}
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

          {/* Password */}
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
          onClick={() => {
            // nanti diganti dengan Supabase signOut
            alert('Logout berhasil')
          }}
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

// Komponen field reusable
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