'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/member/Sidebar'
import { useMobile } from '@/lib/hooks/useMobile'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter();
  const [memberData, setMemberData] = useState({ name: "Anggota", memberId: "" });
  const isMobile = useMobile()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      const role = user.user_metadata?.role;
      if (role !== "member") {
        router.push("/admin");
        return;
      }
      const name = user.user_metadata?.nama_lengkap || "Anggota";
      setMemberData({ name, memberId: user.id?.slice(0, 8).toUpperCase() || "" });
    }
    checkAuth();
  }, [router]);

  return (
    <div
      className={plusJakartaSans.className}
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
      }}
    >
      <Sidebar
        memberName={memberData.name}
        memberId={memberData.memberId}
        isMobile={isMobile}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Hamburger button untuk mobile */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 50,
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'none',
            borderRadius: '8px',
            backgroundColor: sidebarOpen ? '#FDF9F3' : '#F5A623',
            color: sidebarOpen ? '#7B4F1E' : '#fff',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          }}
          aria-label={sidebarOpen ? 'Tutup menu' : 'Buka menu'}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            {sidebarOpen ? (
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <>
                <path d="M3 5H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 10H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M3 15H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      )}

      <main
        style={{
          marginLeft: isMobile ? '0' : '240px',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
          paddingTop: isMobile ? '64px' : '0',
        }}
      >
        {children}
      </main>
    </div>
  )
}