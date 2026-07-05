'use client';

import { useState } from 'react';
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

export default function ProfilPage() {
  // ─── State ───
  const [nama, setNama] = useState('Admin Pustaka');
  const [email, setEmail] = useState('admin@sipustaka.ac.id');
  const [telepon, setTelepon] = useState('0811-2345-6789');
  const [namaPerpustakaan, setNamaPerpustakaan] = useState('Perpustakaan Umum Daerah SiPustaka');
  const [dendaPerHari, setDendaPerHari] = useState(2000);
  const [durasiPinjam, setDurasiPinjam] = useState(5);

  // ─── Modal Ubah Password ───
  const [modalPassword, setModalPassword] = useState(false);
  const [passwordLama, setPasswordLama] = useState('');
  const [passwordBaru, setPasswordBaru] = useState('');
  const [passwordUlangi, setPasswordUlangi] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSimpanProfil = () => alert('✅ Data profil berhasil disimpan!');
  const handleSimpanKonfigurasi = () => alert('✅ Konfigurasi disimpan!');

  const handleUbahPassword = () => {
    if (passwordBaru !== passwordUlangi) {
      alert('❌ Password baru dan ulangan tidak cocok!');
      return;
    }
    if (passwordBaru.length < 6) {
      alert('❌ Password minimal 6 karakter!');
      return;
    }
    alert('✅ Password berhasil diubah!');
    setModalPassword(false);
    setPasswordLama('');
    setPasswordBaru('');
    setPasswordUlangi('');
  };

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

      <div className="grid grid-cols-[1fr_340px] gap-6 mt-6">
        {/* ─── LEFT ─── */}
        <div className="space-y-5">
          {/* Profil Admin */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-4 pb-4 border-b border-[#F3F4F6]">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-[#FEF3DC] flex items-center justify-center text-[#B45309] text-xl font-bold">
                  AU
                </div>
                <button className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full border border-[#E5E7EB] hover:bg-[#F9FAFB]">
                  <Camera size={14} className="text-[#585F6C]" />
                </button>
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
                <label className="text-[13px] font-semibold text-[#374151]">Durasi Pinjam Maksimal (Hari)</label>
                <input
                  type="number"
                  value={durasiPinjam}
                  onChange={(e) => setDurasiPinjam(Number(e.target.value))}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
                <p className="text-[12px] text-[#9CA3AF] mt-1">Standar waktu peminjaman untuk semua anggota.</p>
              </div>

              <div className="bg-[#FEF9C3] border border-[#FDE047] rounded-lg p-3 text-[13px] text-[#854D0E]">
                <AlertCircle size={16} className="inline mr-1.5" />
                Perubahan pada denda dan durasi akan langsung berdampak pada seluruh transaksi peminjaman baru
                yang dilakukan setelah penyimpanan.
              </div>

              <div className="flex gap-3">
                <button className="px-4 py-2 text-[13px] font-semibold text-[#374151] border border-[#E5E7EB] rounded-lg hover:bg-[#F9FAFB] transition-colors">
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
                  <p className="text-[12px] text-[#9CA3AF]">Terakhir diubah 3 bulan lalu</p>
                </div>
                <button
                  onClick={() => setModalPassword(true)}
                  className="text-[13px] font-semibold text-[#B45309] hover:underline"
                >
                  Perbarui Sandi
                </button>
              </div>

              {/* 2FA — Coming Soon */}
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg opacity-60">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Autentikasi 2 Faktor</p>
                  <p className="text-[12px] text-[#9CA3AF]">Coming Soon</p>
                </div>
                <span className="text-[12px] text-[#9CA3AF] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full">
                  Dalam Pengembangan
                </span>
              </div>

              {/* Log Aktivitas — Coming Soon */}
              <div className="flex items-center justify-between p-3 bg-[#F9FAFB] rounded-lg opacity-60">
                <div>
                  <p className="text-[14px] font-semibold text-[#111827]">Log Aktivitas</p>
                  <p className="text-[12px] text-[#9CA3AF]">Coming Soon</p>
                </div>
                <span className="text-[12px] text-[#9CA3AF] bg-[#F3F4F6] px-2.5 py-0.5 rounded-full">
                  Dalam Pengembangan
                </span>
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
            <button className="w-full flex items-center justify-center gap-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors">
              <LogOut size={16} />
              Reset Data Sistem
            </button>
            <button className="w-full flex items-center justify-center gap-2 bg-[#FEE2E2] hover:bg-[#FECACA] text-[#DC2626] rounded-lg px-4 py-2.5 text-[13px] font-semibold transition-colors mt-2">
              <LogOut size={16} />
              Hapus Akun Admin
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
                  adminpustaka
                </div>
              </div>

              <div>
                <label className="text-[13px] font-semibold text-[#374151]">Password Lama</label>
                <div className="relative mt-1.5">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordLama}
                    onChange={(e) => setPasswordLama(e.target.value)}
                    className="w-full text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 pr-10"
                  />
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
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
                  <p className="text-[12px] text-[#DC2626] mt-1">❌ Password tidak cocok, periksa kembali</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-[#E5E7EB]">
              <button onClick={() => setModalPassword(false)} className="px-4 py-2 text-[13px] font-semibold text-[#585F6C] hover:bg-[#F3F4F6] rounded-lg transition-colors">
                Batal
              </button>
              <button
                onClick={handleUbahPassword}
                disabled={!passwordLama || !passwordBaru || !passwordUlangi || passwordBaru !== passwordUlangi || passwordBaru.length < 6}
                className={`px-4 py-2 rounded-lg text-[13px] font-semibold transition-colors shadow-sm ${
                  !passwordLama || !passwordBaru || !passwordUlangi || passwordBaru !== passwordUlangi || passwordBaru.length < 6
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