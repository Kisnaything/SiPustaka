'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { User, Image as ImageIcon, Lock, Camera, ChevronDown, Save } from 'lucide-react';
import { useAnggotaById } from '@/lib/hooks/useAnggota';
import { updateAnggota } from '@/lib/data/anggota';

export default function EditAnggotaPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const anggota = useAnggotaById(id);

  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [telepon, setTelepon] = useState('');
  const [instansi, setInstansi] = useState('');
  const [alamat, setAlamat] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [aktif, setAktif] = useState(true);

  useEffect(() => {
    if (anggota) {
      setNama(anggota.nama);
      setEmail(anggota.email);
      setTelepon(anggota.telepon);
      setInstansi(anggota.instansi);
      setAlamat(anggota.alamat);
      setUsername(anggota.username);
      setPassword(anggota.password);
      setAktif(anggota.status === 'AKTIF');
    }
  }, [anggota]);

  if (!anggota) {
    return <div className="p-6">Anggota tidak ditemukan</div>;
  }

  const handleSubmit = () => {
    if (!nama || !email || !username || !password) {
      alert('Harap lengkapi field wajib: Nama, Email, Username, Password');
      return;
    }

    const updatedData = {
      nama,
      email,
      telepon,
      instansi,
      alamat,
      username,
      password,
      status: aktif ? 'AKTIF' as const : 'NON-AKTIF' as const,
    };

    updateAnggota(id, updatedData);
    router.push('/admin/anggota');
  };

  return (
    <div>
      {/* Breadcrumb */}
      <div className="text-[14px] text-[#9CA3AF] flex items-center gap-2">
        <Link href="/admin/anggota" className="hover:text-[#585F6C]">
          Kelola Data Anggota
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-[#B45309]">Edit Anggota</span>
      </div>

      {/* Title */}
      <div className="mt-4">
        <h1 className="text-[24px] font-bold text-[#111827]">Edit Data Anggota</h1>
        <p className="text-[14px] text-[#585F6C] mt-1">
          Perbarui informasi keanggotaan{' '}
          <span className="font-semibold text-[#374151]">{anggota.nama}</span> (ID: {id}).
        </p>
      </div>

      <div className="grid grid-cols-[1fr_320px] gap-6 mt-6">
        {/* Left: informasi pribadi */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
          <div className="flex items-center gap-2 pb-4 border-b border-[#F3F4F6]">
            <User size={17} className="text-[#B45309]" />
            <h2 className="text-[15px] font-bold text-[#111827]">Informasi Pribadi</h2>
          </div>

          <div className="mt-5 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  ID Anggota
                </label>
                <div className="w-full mt-1.5 text-[14px] font-semibold text-[#B45309] bg-[#FDECC8] border border-[#F3E5C8] rounded-lg px-3.5 py-2.5">
                  {anggota.id}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Alamat Email <span className="text-red-500">*</span>
                </label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Nomor Telepon
                </label>
                <input
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Instansi / Fakultas
              </label>
              <div className="relative mt-1.5">
                <select
                  value={instansi}
                  onChange={(e) => setInstansi(e.target.value)}
                  className="w-full appearance-none text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                >
                  <option value="">Pilih Instansi</option>
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sains Lingkungan">Sains Lingkungan</option>
                  <option value="Fakultas Ekonomi">Fakultas Ekonomi</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                </select>
                <ChevronDown
                  size={16}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[13px] font-semibold text-[#374151]">
                Alamat Lengkap
              </label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={4}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right: foto + akses akun */}
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2">
              <ImageIcon size={17} className="text-[#B45309]" />
              <h2 className="text-[15px] font-bold text-[#111827]">Foto Profil</h2>
            </div>

            <label className="mt-4 flex flex-col items-center gap-3 cursor-pointer">
              <input type="file" accept="image/*" className="hidden" />
              <div className="w-24 h-24 rounded-full bg-[#93C5FD] flex items-center justify-center relative group">
                <Camera size={20} className="text-white/90" />
                <div className="absolute inset-0 rounded-full bg-black/0 group-hover:bg-black/10 transition-colors" />
              </div>
            </label>
            <p className="text-[12px] text-[#9CA3AF] text-center mt-3">
              Klik foto untuk mengganti (maks 2MB, JPG/PNG)
            </p>
          </div>

          <div className="bg-white rounded-xl border border-[#E5E7EB] p-6">
            <div className="flex items-center gap-2">
              <Lock size={17} className="text-[#B45309]" />
              <h2 className="text-[15px] font-bold text-[#111827]">Akses Akun</h2>
            </div>

            <div className="mt-4">
              <label className="text-[13px] font-semibold text-[#374151]">Username</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
              />
            </div>

            <div className="mt-5">
              <label className="text-[13px] font-semibold text-[#374151]">
                Status Keanggotaan
              </label>
              <div className="flex items-center gap-2.5 mt-2">
                <button
                  onClick={() => setAktif((v) => !v)}
                  className={`w-11 h-6 rounded-full relative transition-colors ${
                    aktif ? 'bg-[#16A34A]' : 'bg-[#D1D5DB]'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                      aktif ? 'translate-x-[22px]' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <span className={`text-[14px] font-medium ${aktif ? 'text-[#16A34A]' : 'text-[#585F6C]'}`}>
                  {aktif ? 'Aktif' : 'Non-aktif'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-[#E5E7EB]">
        <Link
          href="/admin/anggota"
          className="text-[14px] font-semibold text-[#374151] border border-[#E5E7EB] rounded-xl px-5 py-3 hover:bg-[#F9FAFB]"
        >
          Batal
        </Link>
        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E0951C] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm"
        >
          <Save size={17} />
          Simpan Perubahan
        </button>
      </div>
    </div>

    
  );
}