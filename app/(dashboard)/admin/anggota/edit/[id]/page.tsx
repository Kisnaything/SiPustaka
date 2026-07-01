'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { User, Image as ImageIcon, Lock, Camera, ChevronDown, Save } from 'lucide-react';

// TODO: ganti dengan fetch data anggota asli berdasarkan params.id
const dummyMember = {
  name: 'Budi Raharjo',
  memberId: 'LIB-2023-001',
  email: 'budi.ra@univ.ac.id',
  phone: '+62 812-3456-7890',
  faculty: 'Teknik Informatika',
  address: 'Jl. Mulyosari No. 12, Surabaya',
  username: 'budi.ra',
  aktif: true,
};

export default function EditAnggotaPage() {
  const params = useParams();
  const [aktif, setAktif] = useState(dummyMember.aktif);

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
          <span className="font-semibold text-[#374151]">{dummyMember.name}</span> (ID:{' '}
          {params?.id}).
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
                  Nama Lengkap
                </label>
                <input
                  defaultValue={dummyMember.name}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  ID Anggota
                </label>
                <div className="w-full mt-1.5 text-[14px] font-semibold text-[#B45309] bg-[#FDECC8] border border-[#F3E5C8] rounded-lg px-3.5 py-2.5">
                  {dummyMember.memberId}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Alamat Email
                </label>
                <input
                  defaultValue={dummyMember.email}
                  className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-[#374151]">
                  Nomor Telepon
                </label>
                <input
                  defaultValue={dummyMember.phone}
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
                  defaultValue={dummyMember.faculty}
                  className="w-full appearance-none text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30"
                >
                  <option>Teknik Informatika</option>
                  <option>Sains Lingkungan</option>
                  <option>Fakultas Ekonomi</option>
                  <option>Sistem Informasi</option>
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
                defaultValue={dummyMember.address}
                rows={4}
                className="w-full mt-1.5 text-[14px] text-[#111827] border border-[#E5E7EB] rounded-lg px-3.5 py-2.5 outline-none focus:ring-2 focus:ring-[#F5A623]/30 resize-none"
              />
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
                defaultValue={dummyMember.username}
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
                <span
                  className={`text-[14px] font-medium ${
                    aktif ? 'text-[#16A34A]' : 'text-[#585F6C]'
                  }`}
                >
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
        <button className="flex items-center gap-2 bg-[#F5A623] hover:bg-[#E0951C] transition-colors text-white text-[14px] font-semibold px-5 py-3 rounded-xl shadow-sm">
          <Save size={17} />
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}