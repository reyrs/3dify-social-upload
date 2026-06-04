import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "3DifyAI — AI 3D Social Media Content Generator",
  description: "Buat konten 3D viral untuk TikTok, Instagram & Reels dalam detik. Tinggal ketik teks, AI generate 3D animation siap upload.",
  openGraph: {
    title: "3DifyAI — AI 3D Social Media Content Generator",
    description: "Buat konten 3D viral untuk TikTok, Instagram & Reels dalam detik.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}
