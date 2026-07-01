import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SiPustaka",
  description: "Sistem Informasi Peminjaman Buku Perpustakaan Berbasis Web",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="font-sans antialiased bg-[#FFF8F4]">
        {children}
      </body>
    </html>
  );
}