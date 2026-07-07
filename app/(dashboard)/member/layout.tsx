'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { Plus_Jakarta_Sans } from 'next/font/google'
import Sidebar from '@/components/member/Sidebar'

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
      <Sidebar memberName={memberData.name} memberId={memberData.memberId} />
      <main
        style={{
          marginLeft: '240px',
          flex: 1,
          minHeight: '100vh',
          backgroundColor: '#F9FAFB',
        }}
      >
        {children}
      </main>
    </div>
  )
}