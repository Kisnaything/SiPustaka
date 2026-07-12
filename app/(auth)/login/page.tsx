"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  BookMarked,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";

type LoginForm = {
  email: string;
  password: string;
};

type FieldErrors = Partial<Record<keyof LoginForm, string>>;

const initialForm: LoginForm = {
  email: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<LoginForm>(initialForm);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  function update<K extends keyof LoginForm>(key: K, value: LoginForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setServerMessage(null);
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!form.email.trim()) {
      next.email = "Email wajib diisi";
    }

    if (!form.password.trim()) {
      next.password = "Password wajib diisi";
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
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const result = await res.json();

      if (!result.success) {
        setServerMessage(result.message);
        return;
      }

      if (result.redirect) {
        router.push(result.redirect);
      }
    } catch {
      setServerMessage("Gagal terhubung ke server. Periksa koneksi internet Anda.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-4 py-8">
      <section className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-8 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookMarked size={22} className="text-white" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Masuk ke akun
          </h1>

          <p className="text-[13px] text-gray-400">
            Selamat datang kembali
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Email" error={errors.email}>
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="contoh@pustaka.com"
                className={inputClass(!!errors.email) + " pl-10"}
              />
            </div>
          </Field>

          <Field label="Password" error={errors.password}>
            <div className="relative">
              <LockKeyhole
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                placeholder="••••••••"
                className={inputClass(!!errors.password) + " pl-10 pr-10"}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </Field>

          <div className="flex items-center justify-end gap-3">
            <Link
              href="/lupa-pass"
              className="text-[12px] font-medium text-amber-700 hover:text-amber-800"
            >
              Lupa Password?
            </Link>
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
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-medium transition-colors shadow-sm"
          >
            {isLoading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-4">
          <p className="text-center text-[13px] text-gray-400">
            Belum punya akun?{" "}
            <Link
              href="/signup-anggota"
              className="text-amber-700 hover:text-amber-800 font-medium"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </section>

      <p className="mt-5 text-center text-[12px] text-gray-400">
        © 2024 SiPustaka Central Library Admin. All rights reserved.
      </p>
    </main>
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
    "w-full bg-white border rounded-xl px-4 py-3 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors",
    hasError
      ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
      : "border-gray-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-100",
  ].join(" ");
}