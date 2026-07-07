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

      // 1. Cek username belum dipakai
      const { data: existingUsername } = await supabase
        .from("users")
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

      // 2. Daftarkan akun ke Supabase Auth (email + password + role metadata)
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            role: "member",
            nama_lengkap: data.namaLengkap,
          },
        },
      });

      if (signUpError || !signUpData.user) {
        return {
          success: false,
          message: signUpError?.message ?? "Gagal membuat akun",
        };
      }

      const userId = signUpData.user.id;

      // 3. Simpan ke tabel users
      const { error: insertError } = await supabase.from("users").insert({
        id: userId,
        nama: data.namaLengkap,
        email: data.email,
        telepon: data.noTelepon,
        alamat: data.alamat,
        username: data.username,
        role: "member",
        status: "MENUNGGU",
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