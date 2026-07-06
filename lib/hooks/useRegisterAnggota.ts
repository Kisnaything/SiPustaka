"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

export type AnggotaFormData = {
  namaLengkap: string;
  tanggalLahir: string; // format yyyy-mm-dd (dari <input type="date">)
  alamat: string;
  noTelepon: string;
  email: string;
  username: string;
  password: string;
  konfirmasiPassword: string;
  fotoProfil: File | null;
};

export type RegisterResult =
  | { success: true }
  | { success: false; message: string; field?: keyof AnggotaFormData };

export function useRegisterAnggota() {
  const [isLoading, setIsLoading] = useState(false);

  async function registerAnggota(data: AnggotaFormData): Promise<RegisterResult> {
    setIsLoading(true);
    try {
      if (data.password !== data.konfirmasiPassword) {
        return {
          success: false,
          message: "Password dan konfirmasi tidak cocok",
          field: "konfirmasiPassword",
        };
      }

      if (data.password.length < 8) {
        return {
          success: false,
          message: "Password minimal 8 karakter",
          field: "password",
        };
      }

      // 1. Cek username belum dipakai pendaftar lain
      const { data: existingUsername } = await supabase
        .from("pendaftar_anggota")
        .select("id")
        .eq("username", data.username)
        .maybeSingle();

      if (existingUsername) {
        return {
          success: false,
          message: "Username sudah digunakan",
          field: "username",
        };
      }

      // 2. Daftarkan akun ke Supabase Auth (email + password)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (signUpError || !signUpData.user) {
        return {
          success: false,
          message: signUpError?.message ?? "Gagal membuat akun",
        };
      }

      const userId = signUpData.user.id;
      let fotoProfilUrl: string | null = null;

      // 3. Upload foto profil kalau ada (opsional)
      if (data.fotoProfil) {
        const ext = data.fotoProfil.name.split(".").pop();
        const path = `${userId}/profil.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("foto-profil")
          .upload(path, data.fotoProfil, { upsert: true });

        if (!uploadError) {
          const { data: publicUrlData } = supabase.storage
            .from("foto-profil")
            .getPublicUrl(path);
          fotoProfilUrl = publicUrlData.publicUrl;
        }
      }

      // 4. Simpan ke tabel pendaftar_anggota, status default "menunggu_verifikasi"
      //    (BUKAN tabel `anggota` - itu khusus anggota yang sudah disetujui admin)
      const { error: insertError } = await supabase.from("pendaftar_anggota").insert({
        id: userId,
        nama_lengkap: data.namaLengkap,
        tanggal_lahir: data.tanggalLahir,
        alamat: data.alamat,
        no_telepon: data.noTelepon,
        email: data.email,
        username: data.username,
        foto_profil_url: fotoProfilUrl,
        status: "menunggu_verifikasi",
      });

      if (insertError) {
        return {
          success: false,
          message: "Gagal menyimpan data pendaftaran: " + insertError.message,
        };
      }

      return { success: true };
    } finally {
      setIsLoading(false);
    }
  }

  return { registerAnggota, isLoading };
}