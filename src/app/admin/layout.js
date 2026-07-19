"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  Newspaper, 
  ShoppingBag, 
  Compass, 
  Sparkles, 
  Users, 
  LogOut, 
  LayoutDashboard, 
  ShieldCheck,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session: activeSession } } = await supabase.auth.getSession();
      if (!activeSession) {
        // Not authenticated, send to login page
        router.push("/login");
      } else {
        setSession(activeSession);
      }
      setLoading(false);
    };

    checkUser();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        router.push("/login");
      } else if (session) {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const menuItems = [
    { name: "Ringkasan", href: "/admin", icon: LayoutDashboard },
    { name: "Kelola Berita", href: "/admin/berita", icon: Newspaper },
    { name: "Kelola UMKM", href: "/admin/umkm", icon: ShoppingBag },
    { name: "Kelola Wisata", href: "/admin/wisata", icon: Compass },
    { name: "Kelola Kesenian", href: "/admin/kesenian", icon: Sparkles },
    { name: "Kelola Pemerintah", href: "/admin/pemerintah", icon: Users },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500" />
        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest animate-pulse">Memverifikasi Hak Akses Admin...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* 1. Sidebar Navigation (Desktop) */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 text-slate-400 border-r border-slate-900 py-8 shrink-0">
        
        {/* Branding header */}
        <div className="px-6 flex items-center space-x-3 mb-10">
          <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center border border-emerald-500">
            <span className="text-white font-black text-xs">TS</span>
          </div>
          <div>
            <h2 className="text-white font-extrabold text-sm leading-none">Dashboard Admin</h2>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-1">Desa Tempursari</p>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-grow px-4 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                  active
                    ? "bg-emerald-800 text-white shadow-md shadow-emerald-800/10"
                    : "hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Info & Logout */}
        <div className="px-6 border-t border-slate-900 pt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-[10px] font-bold text-slate-200 truncate">{session.user.email}</span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-rose-950 hover:text-rose-200 text-rose-500 text-xs font-bold rounded-xl flex items-center justify-center space-x-2 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>

      </aside>

      {/* 2. Mobile Header/Sidebar Drawer */}
      <div className="flex-grow flex flex-col min-w-0">
        <header className="lg:hidden bg-slate-950 text-white h-16 px-4 flex items-center justify-between z-30">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <span className="font-extrabold text-sm tracking-wide">Portal Admin</span>
          </div>
          <span className="text-[10px] font-bold bg-emerald-600 px-3 py-1 rounded-full">ACTIVE</span>
        </header>

        {/* Mobile drawer links */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)} />
            
            {/* Drawer container */}
            <div className="relative w-64 bg-slate-950 text-slate-400 py-8 flex flex-col z-50">
              <div className="px-6 flex items-center justify-between mb-8">
                <span className="font-black text-sm text-white">Menu Admin</span>
                <button onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
              </div>

              <nav className="flex-grow px-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition-all ${
                        active
                          ? "bg-emerald-800 text-white shadow-md"
                          : "hover:bg-slate-900 hover:text-slate-200"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="px-6 pt-6 border-t border-slate-900 space-y-4">
                <button
                  onClick={handleLogout}
                  className="w-full py-2.5 px-4 bg-rose-950 text-rose-200 text-xs font-bold rounded-xl flex items-center justify-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Main Dashboard Content Screen */}
        <main className="flex-grow p-6 md:p-10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
