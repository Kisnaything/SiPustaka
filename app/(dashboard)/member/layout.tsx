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
  return (
    <div
      className={plusJakartaSans.className}
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F9FAFB',
      }}
    >
      <Sidebar />
      {/* Konten utama — diberi margin kiri sebesar lebar sidebar */}
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