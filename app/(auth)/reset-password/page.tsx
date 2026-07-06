"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  BookMarked,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [showPasswordBaru, setShowPasswordBaru] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  function getPasswordStrength() {
    let score = 0;

    if (passwordBaru.length >= 8) score++;
    if (/[A-Z]/.test(passwordBaru) || /[0-9]/.test(passwordBaru)) score++;
    if (/[^A-Za-z0-9]/.test(passwordBaru)) score++;

    return score;
  }

  const strength = getPasswordStrength();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!passwordBaru.trim()) {
      setError("Password baru wajib diisi");
      return;
    }

    if (passwordBaru.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (!konfirmasiPassword.trim()) {
      setError("Konfirmasi password wajib diisi");
      return;
    }

    if (passwordBaru !== konfirmasiPassword) {
      setError("Konfirmasi password tidak sama");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setShowSuccessPopup(true);
    }, 700);
  }

  return (
    <main className="min-h-screen bg-[#FAFAF9] flex flex-col items-center justify-center px-4 py-8">
      <div className="mb-5 text-center">
        <div className="w-16 h-16 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <BookMarked size={30} className="text-white" />
        </div>

        <h1 className="mt-4 text-2xl font-bold text-amber-700">
          SiPustaka
        </h1>
      </div>

      <section className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-8 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Atur Ulang Password
          </h2>

          <p className="text-[13px] leading-relaxed text-gray-500">
            Buat password baru untuk mengamankan akun Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Password baru
            </label>

            <div className="relative">
              <LockKeyhole
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showPasswordBaru ? "text" : "password"}
                value={passwordBaru}
                onChange={(e) => {
                  setPasswordBaru(e.target.value);
                  setError("");
                }}
                placeholder="Min. 8 karakter"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              <button
                type="button"
                onClick={() => setShowPasswordBaru((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Tampilkan atau sembunyikan password baru"
              >
                {showPasswordBaru ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1">
              <div
                className={`h-1 rounded-full ${
                  strength >= 1 ? "bg-amber-400" : "bg-gray-100"
                }`}
              />
              <div
                className={`h-1 rounded-full ${
                  strength >= 2 ? "bg-amber-400" : "bg-gray-100"
                }`}
              />
              <div
                className={`h-1 rounded-full ${
                  strength >= 3 ? "bg-amber-400" : "bg-gray-100"
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Konfirmasi password
            </label>

            <div className="relative">
              <ShieldCheck
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type={showKonfirmasi ? "text" : "password"}
                value={konfirmasiPassword}
                onChange={(e) => {
                  setKonfirmasiPassword(e.target.value);
                  setError("");
                }}
                placeholder="Ulangi password baru"
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 pl-12 pr-12 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none transition-colors focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />

              <button
                type="button"
                onClick={() => setShowKonfirmasi((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Tampilkan atau sembunyikan konfirmasi password"
              >
                {showKonfirmasi ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="flex items-center gap-1.5 text-[12px] text-red-500">
              <AlertCircle size={13} />
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? "Menyimpan..." : "Simpan Password"}
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-5">
          <Link
            href="/login"
            className="flex items-center justify-center gap-2 text-[13px] text-amber-700 hover:text-amber-800 font-medium"
          >
            <ArrowLeft size={16} />
            Kembali ke Login
          </Link>
        </div>
      </section>

      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg border border-gray-100">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500">
              <BookMarked size={22} className="text-white" />
            </div>

            <h3 className="text-lg font-bold text-gray-900">
              Password berhasil disimpan
            </h3>

            <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
              Password baru sudah dibuat. Silakan masuk menggunakan password terbaru.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
            >
              Masuk ke Login
            </button>
          </div>
        </div>
      )}
    </main>
  );
}