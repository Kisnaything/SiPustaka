'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  User,
  Mail,
  Phone,
  Lock,
  LogOut,
  Camera,
  Save,
  AlertCircle,
  Download,
  Shield,
  Eye,
  EyeOff,
  X,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { usePengaturan } from '@/lib/hooks/usePengaturan';
import { updatePengaturan } from '@/lib/data/pengaturan';

function getInisial(nama: string) {
  const parts = nama.trim().split(' ')
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[1][0]).toUpperCase()
}

export default function ProfilPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [username, setUsername] = useState('');

  const pengaturan = usePengaturan();

  const [modalPassword, setModalPassword] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [passwordUlangi, setPasswordUlangi] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [norek, setNorek] = useState('');

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const meta = user.user_metadata || {}
      setNama(meta.nama_lengkap || '')
      setEmail(user.email || '')
      setTelepon(meta.telepon || '')
      setUsername(meta.username || '')
      setLoading(false)

      // Load norek from auth user metadata
      const norekRes = await fetch('/api/norek')
      const norekData = await norekRes.json()
      setNorek(norekData.norek || '')
    }
    load()
  }, [])

  const handleSimpanProfil = async () => {
    const { error } = await supabase.auth.updateUser({
      data: { nama_lengkap: nama, telepon },
    })
    if (error) {
      alert('Gagal menyimpan: ' + error.message)
      return
    }
    alert('Profil berhasil disimpan!')
  }

  const [namaPerpustakaan, setNamaPerpustakaan] = useState(pengaturan.nama_perpustakaan);
  const [dendaPerHari, setDendaPerHari] = useState(pengaturan.denda_per_hari);
  useEffect(() => {
    setNamaPerpustakaan(pengaturan.nama_perpustakaan)
    setDendaPerHari(pengaturan.denda_per_hari)
  }, [pengaturan.nama_perpustakaan, pengaturan.denda_per_hari])
  const handleSimpanKonfigurasi = async () => {
    let ok = true
    try {
      await updatePengaturan({
        nama_perpustakaan: namaPerpustakaan,
        denda_per_hari: dendaPerHari,
      })
    } catch {
      ok = false
    }
    try {
      await fetch('/api/norek', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ norek }),
      })
    } catch {
      ok = false
    }
    if (ok) {
      alert('Konfigurasi berhasil disimpan!')
    } else {
      alert('Gagal menyimpan konfigurasi')
    }
  }

  const handleUbahPassword = async () => {
    if (passwordBaru !== passwordUlangi) {
      alert('Password baru dan ulangan tidak cocok!')
      return
    }
    if (passwordBaru.length < 6) {
      alert('Password minimal 6 karakter!')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: passwordBaru })
    if (error) {
      alert('Gagal mengubah password: ' + error.message)
      return
    }

    alert('Password berhasil diubah!')
    setModalPassword(false)
    setPasswordLama('')
    setPasswordBaru('')
    setPasswordUlangi('')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result as string;
      await supabase.auth.updateUser({ data: { foto_profil: dataUrl } });
      alert('Foto profil berhasil diperbarui!');
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 text-[14px] text-[#9CA3AF]">
        Memuat profil...
      </div>
    )
  }

  const inisial = getInisial(nama || 'A')

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[24px] font-bold text-[#111827]">Profil & Pengaturan</h1>
          <p className="text-[14px] text-[#585F6C] mt-1">
            Kelola identitas perpustakaan, kebijakan peminjaman, dan keamanan akun Anda.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 mt-6">
        {/* ─── LEFT ─── */}
        <div className="space-y-5">
          {/* Profil Admin */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 sm:p-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#F3F4F6]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#FEF3DC] flex items-center justify-center text-[#B45309] text-xl font-bold">
                  {inisial}
                </div>
                <button onClick={handleFotoClick} className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <Camera size={14} className="text-[#585F6C]" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFotoChange}
                />
              </div>
              <div>
                <p className="text-[15px] font-bold text-[#111827]">{nama}</p>
                <p className="text-[13px] text-[#585F6C]">Super Admin</p>
                <span className="inline-block mt-1 text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-2.5 py-0.5 rounded-full">
                  Aktif
                </span>
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Nama Lengkap</label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Email</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">No. Telepon</label>
                <input
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <button
                onClick={handleSimpanProfil}
                className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-[14px] font-semibold px-5 py-2.5 rounded-xl transition-colors"
              >
                <Save size={16} />
                Simpan Perubahan
              </button>
            </div>
          </div>

          {/* Konfigurasi Perpustakaan */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] mb-4">Konfigurasi Perpustakaan</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Nama Perpustakaan</label>
                <input
                  value={namaPerpustakaan}
                  onChange={(e) => setNamaPerpustakaan(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Denda Per Hari (Rp)</label>
                <input
                  type="number"
                  value={dendaPerHari}
                  onChange={(e) => setDendaPerHari(Number(e.target.value))}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
                <p className="text-[12px] text-[#9CA3AF] mt-1">Diberlakukan untuk setiap keterlambatan buku.</p>
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  No. Rekening Pembayaran Denda
                </label>
                <input
                  value={norek}
                  onChange={(e) => setNorek(e.target.value)}
                  placeholder="Contoh: BCA 123456789 a.n. Perpustakaan"
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
                <p className="text-[12px] text-[#9CA3AF] mt-1">
                  Nomor rekening tujuan pembayaran denda yang akan ditampilkan ke anggota.
                </p>
              </div>
              <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-lg p-3 text-[13px] text-[#854D0E]">
                <AlertCircle size={16} className="inline mr-1.5" />
                Perubahan pada denda akan langsung berdampak pada seluruh transaksi peminjaman baru
                yang dilakukan setelah penyimpanan.
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setNamaPerpustakaan(pengaturan.nama_perpustakaan);
                    setDendaPerHari(pengaturan.denda_per_hari);
                    fetch('/api/norek').then(r => r.json()).then(d => setNorek(d.norek || '')).catch(() => {})
                  }}
                  className="px-4 py-2 text-[13px] font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors"
                >
                  Batalkan
                </button>
                <button
                  onClick={handleSimpanKonfigurasi}
                  className="flex items-center gap-2 bg-[#B45309] hover:bg-[#92400E] text-white text-[13px] font-semibold px-5 py-2 rounded-lg transition-colors"
                >
                  <Save size={16} />
                  Simpan Konfigurasi
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ─── RIGHT ─── */}
        <div className="space-y-5">
          {/* Keamanan & Autentikasi */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] flex items-center gap-2 mb-4">
              <Lock size={18} className="text-[#B45309]" />
              Keamanan &amp; Autentikasi
            </h2>

            <div className="space-y-4">
              {/* Ubah Password */}
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Ubah Kata Sandi</p>
                  <p className="text-[12px] text-[#9CA3AF]">Update password akun admin</p>
                </div>
                <button
                  onClick={() => setModalPassword(true)}
                  className="text-[13px] font-semibold text-[#B45309] hover:underline"
                >
                  Perbarui Sandi
                </button>
              </div>

              {/* Logout */}
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Keluar</p>
                  <p className="text-[12px] text-[#9CA3AF]">Akhiri sesi login</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-[13px] font-semibold text-[#DC2626] hover:underline"
                >
                  Keluar
                </button>
              </div>
            </div>
          </div>

          {/* Ekspor & Cadangan */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <h2 className="text-[15px] font-bold text-[#111827] mb-4">Ekspor &amp; Cadangan Data</h2>
            <button className="w-full flex items-center justify-center gap-2 bg-[#F9FAFB] hover:bg-[#F3F4F6] border border-[#E5E7EB] rounded-lg px-4 py-2.5 text-[13px] font-semibold text-[#374151] transition-colors">
              <Download size={16} />
              Unduh CSV / PDF
            </button>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-xl border border-[#FEE2E2] p-6">
            <h2 className="text-[15px] font-bold text-[#DC2626] mb-4">Zona Bahaya</h2>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors"
            >
              <LogOut size={16} />
              Keluar
            </button>
          </div>
        </div>
      </div>

      {/* ─── MODAL UBAH PASSWORD ─── */}
      {modalPassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setModalPassword(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-[18px] font-bold text-[#111827]">Ubah Kata Sandi</h2>
                <p className="text-[13px] text-[#585F6C] mt-1">Masukkan password lama dan baru Anda.</p>
              </div>
              <button onClick={() => setModalPassword(false)} className="p-1 hover:bg-[#F3F4F6] rounded-lg">
                <X size={20} className="text-[#9CA3AF]" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Username</label>
                <div className="mt-1.5 text-[14px] text-[#9CA3AF] bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5">
                  {username}
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Password Baru</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordBaru}
                  onChange={(e) => setPasswordBaru(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Ulangi Password Baru</label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordUlangi}
                  onChange={(e) => setPasswordUlangi(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
                {passwordBaru && passwordUlangi && passwordBaru !== passwordUlangi && (
                  <p className="text-[12px] text-[#DC2626] mt-1">Password tidak cocok, periksa kembali</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
              <button onClick={() => setModalPassword(false)} className="px-4 py-2 text-[13px] font-semibold text-[#585F6C] hover:bg-[#F3F4F6] rounded-lg transition-colors">
                Batal
              </button>
              <button
                onClick={handleUbahPassword}
                disabled={!passwordBaru || !passwordUlangi || passwordBaru !== passwordUlangi || passwordBaru.length < 6}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm ${
                  !passwordBaru || !passwordUlangi || passwordBaru !== passwordUlangi || passwordBaru.length < 6
                    ? 'bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed'
                    : 'bg-[#B45309] hover:bg-[#92400E] text-white'
                }`}
              >
                Ubah Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
