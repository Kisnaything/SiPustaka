'use client';

import { BookMarked, LogIn } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-gray-100 shadow-sm p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto">
            <BookMarked size={22} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Masuk ke SiPustaka</h1>
          <p className="text-[13px] text-gray-400">Silakan masuk ke akun administrator</p>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Email</label>
            <input type="email" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="admin@sipustaka.com" />
          </div>
          <div>
            <label className="block text-[13px] font-medium text-gray-700 mb-1.5">Password</label>
            <input type="password" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-[13px] text-gray-700 placeholder:text-gray-400 outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100" placeholder="••••••••" />
          </div>
          <button className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl text-[13px] font-medium transition-colors">
            <LogIn size={16} /> Masuk
          </button>
        </div>
        <p className="text-center text-[12px] text-gray-400">
          Belum punya akun?{" "}
          <Link href="/signup" className="text-amber-600 hover:text-amber-700 font-medium">Daftar</Link>
        </p>
      </div>
    </div>
  );
}
