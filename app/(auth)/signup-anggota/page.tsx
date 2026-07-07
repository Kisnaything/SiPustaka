"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BookMarked, Eye, EyeOff, AlertCircle } from "lucide-react";
import {
  useRegisterAnggota,
  type AnggotaFormData,
} from "@/lib/hooks/useRegisterAnggota";

const initialForm: AnggotaFormData = {
  namaLengkap: "",
  tanggalLahir: "",
  alamat: "",
  noTelepon: "",
  email: "",
  username: "",
  password: "",
  konfirmasiPassword: "",
};

type FieldErrors = Partial<Record<keyof AnggotaFormData, string>>;

export default function SignupAnggotaPage() {
  const router = useRouter();
  const { registerAnggota, isLoading } = useRegisterAnggota();

  const [form, setForm] = useState<AnggotaFormData>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  function update<K extends keyof AnggotaFormData>(
    key: K,
    value: AnggotaFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    (Object.keys(form) as (keyof AnggotaFormData)[]).forEach((key) => {
      if (!String(form[key]).trim()) {
        next[key] = "Field ini wajib diisi";
      }
    });

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerMessage(null);

    if (!validate()) return;

    const result = await registerAnggota(form);

    if (!result.success) {
      setServerMessage(result.message);

      if (result.field) {
        setErrors((prev) => ({
          ...prev,
          [result.field!]: result.message,
        }));
      }

      return;
    }

    router.push("/login?daftar=berhasil");
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookMarked size={22} className="text-white" />
          </div>

          <h1 className="text-xl font-bold text-gray-900">
            Daftar sebagai Anggota
          </h1>

          <p className="text-[13px] text-gray-400">
            Isi data diri sesuai identitas kamu
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Nama Lengkap" error={errors.namaLengkap}>
            <input
              value={form.namaLengkap}
              onChange={(e) => update("namaLengkap", e.target.value)}
              placeholder="Nama lengkap kamu"
              className={inputClass(!!errors.namaLengkap)}
            />
          </Field>

          <Field label="Tanggal Lahir" error={errors.tanggalLahir}>
            <input
              type="date"
              value={form.tanggalLahir}
              onChange={(e) => update("tanggalLahir", e.target.value)}
              className={inputClass(!!errors.tanggalLahir)}
            />
          </Field>

          <Field label="Alamat" error={errors.alamat}>
            <textarea
              value={form.alamat}
              onChange={(e) => update("alamat", e.target.value)}
              placeholder="Alamat lengkap saat ini"
              rows={3}
              className={inputClass(!!errors.alamat)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="No. Telepon" error={errors.noTelepon}>
              <input
                value={form.noTelepon}
                onChange={(e) => update("noTelepon", e.target.value)}
                placeholder="08XX-XXXX-XXXX"
                className={inputClass(!!errors.noTelepon)}
              />
            </Field>

            <Field label="Email" error={errors.email}>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="email@contoh.com"
                className={inputClass(!!errors.email)}
              />
            </Field>
          </div>

          <Field label="Username" error={errors.username}>
            <input
              value={form.username}
              onChange={(e) => update("username", e.target.value)}
              placeholder="username_kamu"
              className={inputClass(!!errors.username)}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
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

            <Field
              label="Konfirmasi Password"
              error={errors.konfirmasiPassword}
            >
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.konfirmasiPassword}
                  onChange={(e) =>
                    update("konfirmasiPassword", e.target.value)
                  }
                  placeholder="Ulangi password"
                  className={inputClass(!!errors.konfirmasiPassword) + " pr-9"}
                />

                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Tampilkan/sembunyikan konfirmasi password"
                >
                  {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </Field>
          </div>

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
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
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
            Ingin daftar sebagai administrator?{" "}
            <Link
              href="/signup-admin"
              className="text-amber-600 hover:text-amber-700 font-medium"
            >
              Daftar admin
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