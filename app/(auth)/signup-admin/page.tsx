"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { BookMarked, Eye, EyeOff, AlertCircle } from "lucide-react";

type AdminFormData = {
  namaLengkap: string;
  email: string;
  noTelepon: string;
  username: string;
  password: string;
  kodeAkses: string;
};

type FieldErrors = Partial<Record<keyof AdminFormData, string>>;

const initialForm: AdminFormData = {
  namaLengkap: "",
  email: "",
  noTelepon: "",
  username: "",
  password: "",
  kodeAkses: "",
};

const ADMIN_ACCESS_CODE = "ADMIN123";

export default function SignupAdminPage() {
  const router = useRouter();

  const [form, setForm] = useState<AdminFormData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function update<K extends keyof AdminFormData>(
    key: K,
    value: AdminFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerMessage(null);
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!form.namaLengkap.trim()) {
      next.namaLengkap = "Field ini wajib diisi";
    }

    if (!form.email.trim()) {
      next.email = "Field ini wajib diisi";
    }

    if (!form.noTelepon.trim()) {
      next.noTelepon = "Field ini wajib diisi";
    }

    if (!form.username.trim()) {
      next.username = "Field ini wajib diisi";
    }

    if (!form.password.trim()) {
      next.password = "Field ini wajib diisi";
    }

    if (form.password.length < 8) {
      next.password = "Password minimal 8 karakter";
    }

    if (!form.kodeAkses.trim()) {
      next.kodeAkses = "Field ini wajib diisi";
    } else if (form.kodeAkses.trim() !== ADMIN_ACCESS_CODE) {
      next.kodeAkses = "Kode akses tidak valid. Silakan hubungi koordinator IT.";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage(null);

    if (!validate()) return;

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            role: "admin",
            nama_lengkap: form.namaLengkap,
          },
        },
      });

      if (error) {
        setServerMessage(error.message);
        return;
      }

      if (!data.user) {
        setServerMessage("Gagal mendaftarkan admin. Silakan coba lagi.");
        return;
      }

      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        nama: form.namaLengkap,
        email: form.email,
        telepon: form.noTelepon,
        username: form.username,
        role: "admin",
        status: "AKTIF",
      });

      if (insertError) {
        await supabase.auth.admin?.deleteUser(data.user.id);
        setServerMessage("Gagal menyimpan data admin.");
        return;
      }

      await supabase.auth.signOut();
      router.push("/login?daftar=admin-berhasil");
    } catch {
      setServerMessage("Gagal mendaftarkan admin. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookMarked size={22} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Daftar sebagai Admin
          </h1>

          <p className="text-[13px] text-gray-400">
            Khusus staf perpustakaan yang berwenang
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Lengkap" error={errors.namaLengkap}>
            <input
              value={form.namaLengkap}
              onChange={(e) => update("namaLengkap", e.target.value)}
              placeholder="Nama lengkap admin"
              className={inputClass(!!errors.namaLengkap)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="staf@sipustaka.id"
                className={inputClass(!!errors.email)}
              />
            </Field>

            <Field label="No. Telepon" error={errors.noTelepon}>
              <input
                value={form.noTelepon}
                onChange={(e) => update("noTelepon", e.target.value)}
                placeholder="08XX-XXXX-XXXX"
                className={inputClass(!!errors.noTelepon)}
              />
            </Field>
          </div>

          <Field label="Username" error={errors.username}>
            <input
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              placeholder="admin_sipustaka"
              className={inputClass(!!errors.username)}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="Min. 8 karakter"
                className={inputClass(!!errors.password) + " pr-9"}
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Tampilkan/sembunyikan password"
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </Field>

          <Field label="Kode Akses Admin" error={errors.kodeAkses}>
            <input
              value={form.kodeAkses}
              onChange={(e) => update("kodeAkses", e.target.value)}
              placeholder="Masukkan kode akses"
              className={inputClass(!!errors.kodeAkses)}
            />
          </Field>

          {serverMessage && (
            <p className="flex items-center gap-1.5 text-[12px] text-red-500">
              <AlertCircle size={13} />
              {serverMessage}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-2.5 rounded-xl text-[13px] font-medium transition-colors"
          >
            {isLoading ? "Memproses..." : "Daftar sebagai Admin"}
          </button>
        </form>

        <div className="space-y-1">
          <p className="text-center text-[12px] text-gray-400">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Masuk di sini
            </Link>
          </p>

          <p className="text-center text-[11px] text-gray-400">
            Bukan admin?{" "}
            <Link
              href="/signup-anggota"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Daftar sebagai anggota
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
        {label}
      </label>

      {children}

      {error && (
        <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(hasError: boolean) {
  return [
    "w-full bg-white border rounded-xl px-4 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100",
  ].join(" ");
}