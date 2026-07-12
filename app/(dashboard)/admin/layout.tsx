'use client';

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useMobile } from '@/lib/hooks/useMobile';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  BarChart3,
  Bell,
  User,
  LogOut,
  Search,
  Menu,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Page =
  | "dashboard"
  | "buku"
  | "anggota"
  | "peminjaman"
  | "pengembalian"
  | "verifikasi"
  | "laporan"
  | "notifikasi"
  | "profil";

interface NavItem {
  id: Page;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: "dashboard", label: "Utama", icon: <LayoutDashboard size={18} /> },
  { id: "buku", label: "Buku", icon: <BookOpen size={18} /> },
  { id: "anggota", label: "Anggota", icon: <Users size={18} /> },
  { id: "peminjaman", label: "Peminjaman", icon: <ClipboardList size={18} /> },
  { id: "pengembalian", label: "Pengembalian", icon: <RotateCcw size={18} /> },
  { id: "verifikasi", label: "Verifikasi", icon: <ShieldCheck size={18} /> },
  { id: "laporan", label: "Laporan", icon: <BarChart3 size={18} /> },
];

// ─── Sidebar ─────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, isMobile, isOpen, onClose }: { active: Page; onNav: (p: Page) => void; isMobile: boolean; isOpen: boolean; onClose: () => void }) {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <aside
      className={`bg-[#F9FAFB] border-r border-[#E5E7EB] flex flex-col ${
        isMobile
          ? `fixed top-0 left-0 h-screen w-[240px] z-50 transition-transform duration-300 ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`
          : 'fixed top-0 left-0 h-screen w-[240px]'
      }`}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="w-10 h-10 bg-[#F5A623] rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen size={20} className="text-white" />
        </div>
        <div>
          <p className="text-[18px] font-bold text-[#835500] leading-tight">SiPustaka</p>
          <p className="text-[11px] text-[#585F6C]">Admin System</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 space-y-0.5">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNav(item.id); if (isMobile) onClose(); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                isActive
                  ? "bg-[#FEF3DC] text-[#835500] border-l-[3px] border-[#835500] pl-[13px]"
                  : "text-[#585F6C] hover:bg-white/50"
              }`}
            >
              <span className={isActive ? "text-[#835500]" : "text-[#585F6C]"}>
                {item.icon}
              </span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-[#E5E7EB] px-3 py-4 space-y-0.5">
        <button
          onClick={() => { onNav("profil"); if (isMobile) onClose(); }}
          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
            active === "profil"
              ? "bg-[#FEF3DC] text-[#835500]"
              : "text-[#585F6C] hover:bg-white/50"
          }`}
        >
          <User size={18} />
          Profil
        </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-semibold text-[#DC2626] hover:bg-red-50 transition-all"
          >
            <LogOut size={18} />
            Keluar
          </button>
      </div>
    </aside>
  );
}

// ─── Topbar ──────────────────────────────────────────────────────────────────
function Topbar({ onNotifClick, onMenuClick, adminName, adminInitials, isMobile }: { onNotifClick: () => void; onMenuClick: () => void; adminName: string; adminInitials: string; isMobile: boolean }) {
  return (
    <header className="h-[75px] bg-[#FFF8F4] border-b border-[#E5E7EB] flex items-center px-4 lg:px-6 sticky top-0 z-40">
      {/* Mobile hamburger */}
      {isMobile && (
        <button
          onClick={onMenuClick}
          className="mr-3 w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100/50 transition-colors"
        >
          <Menu size={20} className="text-[#524534]" />
        </button>
      )}

      {/* Search */}
      <div className={`relative ${isMobile ? 'flex-1 max-w-[160px] sm:max-w-xs' : 'flex-1 max-w-xl'}`}>
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" />
        <input
          className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-lg pl-9 pr-4 py-2.5 text-[14px] text-[#111827] placeholder:text-[#6B7280] outline-none focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
          placeholder={isMobile ? "Cari..." : "Cari buku, anggota, atau laporan..."}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const val = (e.target as HTMLInputElement).value.trim();
              if (val) window.location.href = `/admin/buku?search=${encodeURIComponent(val)}`;
            }
          }}
        />
      </div>

      {/* Right */}
      <div className="ml-auto flex items-center gap-2 lg:gap-4">
        <button onClick={onNotifClick} className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100/50 transition-colors">
          <Bell size={20} className="text-[#524534]" />
        </button>
        <div className="flex items-center gap-3 pl-3 lg:pl-4 border-l border-[#E5E7EB]">
          <div className="text-right hidden sm:block">
            <p className="text-[13px] font-semibold text-[#111827] leading-tight">{adminName}</p>
            <p className="text-[12px] font-medium text-[#524534]">Super Admin</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#F5A623]/20 border border-[#E5E7EB] flex items-center justify-center text-[#835500] font-bold text-sm">
            {adminInitials}
          </div>
        </div>
      </div>
    </header>
  );
}

// ─── Main Layout ────────────────────────────────────────────────────────────
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [adminName, setAdminName] = useState("Admin");
  const [adminInitials, setAdminInitials] = useState("AD");
  const isMobile = useMobile(1024);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const role = user.user_metadata?.role;
      if (role !== "admin") {
        router.push("/member");
        return;
      }
      const name = user.user_metadata?.nama_lengkap || "Admin";
      setAdminName(name);
      setAdminInitials(
        name
          .split(" ")
          .map((w: string) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      );
    }
    checkAuth();
  }, [router]);

  const getActivePage = (): Page => {
    if (pathname === "/admin") return "dashboard";
    if (pathname.startsWith("/admin/buku")) return "buku";
    if (pathname.startsWith("/admin/anggota")) return "anggota";
    if (pathname.startsWith("/admin/peminjaman")) return "peminjaman";
    if (pathname.startsWith("/admin/pengembalian")) return "pengembalian";
    if (pathname.startsWith("/admin/verifikasi")) return "verifikasi";
    if (pathname.startsWith("/admin/laporan")) return "laporan";
    if (pathname.startsWith("/admin/notifikasi")) return "notifikasi";
    if (pathname.startsWith("/admin/profil")) return "profil";
    return "dashboard";
  };

  const handleNav = (page: Page) => {
    const routeMap: Record<Page, string> = {
      dashboard: "/admin",
      buku: "/admin/buku",
      anggota: "/admin/anggota",
      peminjaman: "/admin/peminjaman",
      pengembalian: "/admin/pengembalian",
      verifikasi: "/admin/verifikasi",
      laporan: "/admin/laporan",
      notifikasi: "/admin/notifikasi",
      profil: "/admin/profil",
    };
    router.push(routeMap[page]);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F4]">
      {/* Mobile backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        active={getActivePage()}
        onNav={handleNav}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <main className={`${isMobile ? '' : 'ml-[240px]'} min-h-screen flex flex-col`}>
        <Topbar
          onNotifClick={() => router.push("/admin/notifikasi")}
          onMenuClick={() => setSidebarOpen((v) => !v)}
          adminName={adminName}
          adminInitials={adminInitials}
          isMobile={isMobile}
        />
        <div className="flex-1 p-4 lg:p-7">{children}</div>
      </main>
    </div>
  );
}
