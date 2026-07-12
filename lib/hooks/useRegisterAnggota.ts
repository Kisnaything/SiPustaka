"use client";

import { useState } from "react";

export type AnggotaFormData = {
  namaLengkap: string;
  tanggalLahir: string;
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

      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          namaLengkap: data.namaLengkap,
          tanggalLahir: data.tanggalLahir,
          alamat: data.alamat,
          noTelepon: data.noTelepon,
          email: data.email,
          username: data.username,
          password: data.password,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        return { success: false, message: result.message || "Terjadi kesalahan pada server", field: result.field };
      }

      return { success: true };
    } catch {
      return { success: false, message: "Gagal terhubung ke server" };
    } finally {
      setIsLoading(false);
    }
  }

  return { registerAnggota, isLoading };
}