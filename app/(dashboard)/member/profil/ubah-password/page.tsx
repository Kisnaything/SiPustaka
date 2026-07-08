'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function UbahPasswordPage() {
  const router = useRouter()
  const [passwordBaru, setPasswordBaru] = useState('')
  const [passwordUlangi, setPasswordUlangi] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    if (passwordBaru.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }
    if (passwordBaru !== passwordUlangi) {
      setError('Password tidak cocok')
      return
    }

    setLoading(true)
    const { error: err } = await supabase.auth.updateUser({ password: passwordBaru })
    setLoading(false)

    if (err) {
      setError(err.message)
      return
    }

    setSuccess(true)
    setPasswordBaru('')
    setPasswordUlangi('')
    setTimeout(() => router.push('/member/profil'), 2000)
  }

  return (
    <div style={{
      padding: '28px 32px',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
      maxWidth: '500px',
    }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#111827', margin: '0 0 8px' }}>
        Ubah Password
      </h1>
      <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 28px' }}>
        Masukkan password baru untuk akun Anda.
      </p>

      {success && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#DCFCE7',
          color: '#15803D',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '20px',
        }}>
          Password berhasil diubah! Mengalihkan...
        </div>
      )}

      {error && (
        <div style={{
          padding: '12px 16px',
          backgroundColor: '#FEE2E2',
          color: '#DC2626',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 500,
          marginBottom: '20px',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #E5E7EB',
        borderRadius: '12px',
        padding: '24px',
      }}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px',
          }}>
            Password Baru
          </label>
          <input
            type="password"
            value={passwordBaru}
            onChange={(e) => setPasswordBaru(e.target.value)}
            placeholder="Minimal 6 karakter"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label style={{
            display: 'block',
            fontSize: '13px',
            fontWeight: 600,
            color: '#374151',
            marginBottom: '6px',
          }}>
            Ulangi Password Baru
          </label>
          <input
            type="password"
            value={passwordUlangi}
            onChange={(e) => setPasswordUlangi(e.target.value)}
            placeholder="Ketik ulang password baru"
            style={{
              width: '100%',
              padding: '10px 14px',
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              fontSize: '14px',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !passwordBaru || !passwordUlangi}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: loading || !passwordBaru || !passwordUlangi ? '#E5E7EB' : '#F5A623',
            color: loading || !passwordBaru || !passwordUlangi ? '#9CA3AF' : '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading || !passwordBaru || !passwordUlangi ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Menyimpan...' : 'Ubah Password'}
        </button>
      </form>
    </div>
  )
}
