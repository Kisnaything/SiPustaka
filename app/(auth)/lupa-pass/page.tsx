"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import {
  AlertCircle,
  ArrowLeft,
  BookMarked,
  Mail,
  Send,
  ShieldCheck,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");

  const [error, setError] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showInstructionPopup, setShowInstructionPopup] = useState(false);

  async function handleSendInstruction(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Alamat email wajib diisi");
      return;
    }

    setIsLoading(true);

    const { error: resetError } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setShowInstructionPopup(true);
  }

  function handlePopupOk() {
    setShowInstructionPopup(false);
    router.push("/login");
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
            Lupa Password
          </h2>

          <p className="text-[13px] leading-relaxed text-gray-500">
            Masukkan email Anda untuk menerima instruksi reset password
          </p>
        </div>

        <form onSubmit={handleSendInstruction} className="space-y-5">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">
              Alamat Email
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="nama@email.com"
                className={inputClass(!!error) + " pl-12"}
              />
            </div>

            {error && (
              <p className="flex items-center gap-1 text-[11px] text-red-500 mt-1.5">
                <AlertCircle size={12} />
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-amber-500 hover:bg-amber-600 disabled:opacity-60 text-white py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {isLoading ? "Mengirim..." : "Kirim Instruksi"}
            {!isLoading && <Send size={17} />}
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

      <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber-50 px-5 py-2 text-[12px] text-amber-700">
        <ShieldCheck size={15} />
        Sistem Keamanan Terenkripsi
      </div>

      <p className="mt-4 text-center text-[12px] text-gray-400">
        © 2024 SiPustaka. Kelola literasi dengan hati.
      </p>

      {showInstructionPopup && (
        <Popup
          title="Instruksi berhasil dikirim"
          description="Silakan periksa email Anda untuk melanjutkan proses reset password."
          buttonText="OK"
          onClick={handlePopupOk}
        />
      )}
    </main>
  );
}

function Popup({
  title,
  description,
  buttonText,
  onClick,
}: {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-lg border border-gray-100">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500">
          <BookMarked size={22} className="text-white" />
        </div>

        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>

        <p className="mt-2 text-[13px] leading-relaxed text-gray-500">
          {description}
        </p>

        <button
          type="button"
          onClick={onClick}
          className="mt-5 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-amber-600"
        >
          {buttonText}
        </button>
      </div>
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