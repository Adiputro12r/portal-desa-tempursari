"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const pathname = usePathname();

  // Listen to scroll to adjust navbar background opacity
  // (hooks must always be called before any early returns)
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide Navbar on Admin and Login pages (after all hooks)
  if (pathname && (pathname.startsWith("/admin") || pathname === "/login")) {
    return null;
  }

  const navLinks = [
    { name: "DESA TEMPURSARI", href: "/" },
    { name: "KABAR DESA", href: "/kabar-desa" },
    { name: "OBJEK WISATA", href: "/umkm-wisata" },
    { name: "KESENIAN DAERAH", href: "/kesenian" },
  ];

  const profileLinks = [
    { name: "Lembaga Desa", href: "/profil/lembaga" },
    { name: "Demografi Penduduk", href: "/profil/demografi" },
  ];

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-900/90 text-white shadow-lg backdrop-blur-md py-3"
          : "bg-black/30 text-white backdrop-blur-[2px] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-400 group-hover:scale-105 transition-transform">
              <span className="text-white font-black text-sm">TS</span>
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-wide block group-hover:text-emerald-300 transition-colors">
                Desa Tempursari
              </span>
              <span className="text-[10px] text-slate-300 block -mt-1 font-medium tracking-widest uppercase">
                Official Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-xs font-bold tracking-wider hover:text-emerald-400 transition-colors relative py-2 ${
                  isActive(link.href) ? "text-emerald-400" : "text-slate-100"
                }`}
              >
                {link.name}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-emerald-400 rounded-full" />
                )}
              </Link>
            ))}

            {/* Dropdown Profil Desa */}
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                onBlur={() => setTimeout(() => setShowProfileDropdown(false), 200)}
                className={`flex items-center text-xs font-bold tracking-wider hover:text-emerald-400 transition-colors py-2 space-x-1 ${
                  pathname.startsWith("/profil") ? "text-emerald-400" : "text-slate-100"
                }`}
              >
                <span>PROFIL DESA</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-md shadow-2xl overflow-hidden py-1 z-50 animate-fade-in">
                  {profileLinks.map((subLink) => (
                    <Link
                      key={subLink.name}
                      href={subLink.href}
                      className="block px-4 py-2.5 text-xs font-semibold text-slate-200 hover:bg-emerald-700 hover:text-white transition-colors"
                    >
                      {subLink.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Peta Interaktif Button */}
            <Link
              href="/peta"
              className={`text-xs font-bold tracking-wider px-4 py-2 rounded-full border border-emerald-500 transition-all ${
                isActive("/peta")
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-transparent text-slate-100 hover:bg-emerald-600 hover:text-white"
              }`}
            >
              PETA INTERAKTIF
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-100 hover:text-white focus:outline-none p-2 rounded-md hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pt-2 pb-6 space-y-2 shadow-2xl animate-slide-down">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`block px-3 py-3 rounded-md text-sm font-bold tracking-wider hover:bg-slate-800 transition-colors ${
                isActive(link.href) ? "text-emerald-400 bg-slate-800/50" : "text-slate-100"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Profil Desa Submenu inside Mobile Menu */}
          <div className="border-t border-slate-800 pt-2 mt-2">
            <span className="px-3 text-[10px] font-bold text-slate-500 tracking-widest uppercase block mb-1">
              Profil Desa
            </span>
            {profileLinks.map((subLink) => (
              <Link
                key={subLink.name}
                href={subLink.href}
                onClick={() => setIsOpen(false)}
                className={`block px-6 py-2.5 rounded-md text-sm font-semibold hover:bg-slate-800 transition-colors ${
                  pathname === subLink.href ? "text-emerald-400 bg-slate-800/30" : "text-slate-300"
                }`}
              >
                {subLink.name}
              </Link>
            ))}
          </div>

          <Link
            href="/peta"
            onClick={() => setIsOpen(false)}
            className={`block text-center mt-4 px-3 py-3 rounded-full border text-sm font-bold tracking-wider transition-colors ${
              isActive("/peta")
                ? "bg-emerald-600 border-emerald-600 text-white"
                : "border-emerald-500 text-slate-100 hover:bg-emerald-600"
            }`}
          >
            PETA INTERAKTIF
          </Link>
        </div>
      )}
    </nav>
  );
}
