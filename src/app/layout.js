import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import LoadingScreen from "@/components/ui/LoadingScreen";
import DataPrefetcher from "@/components/layout/DataPrefetcher";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata = {
  title: "Website Resmi Desa Tempursari",
  description: "Portal Resmi Infografis, Wisata, UMKM, Kebudayaan, dan Peta Interaktif Desa Tempursari. Media Transparansi Informasi Desa KKN 2026.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-800 font-sans">
        {/* Splash transition loading screen */}
        <LoadingScreen />

        {/* Global sticky navigation bar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Footer with credit watermark */}
        <Footer />

        {/* Background data prefetcher — fetch semua data Supabase ke cache
            agar navigasi antar halaman tidak perlu loading ulang */}
        <DataPrefetcher />
      </body>
    </html>
  );
}
