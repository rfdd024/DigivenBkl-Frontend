"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";

const Navbar = () => {
  const { isAuthenticated, userProfile, logout } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={assets.logo || "/logo.png"}
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
              <span className="font-bold text-[#129990] text-lg">UMKM Expo</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:items-center gap-6">
            <Link href="/" className="hover:text-[#129990] transition">Beranda</Link>
            <Link href="/products" className="hover:text-[#129990] transition">Produk</Link>
            <Link href="/public-umkms" className="hover:text-[#129990] transition">UMKM</Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="hover:text-[#129990] transition">Dashboard</Link>
                <Link href="/dashboard/profile" className="hover:text-[#129990] transition">Profil</Link>
                <button
                  onClick={logout}
                  className="ml-2 px-4 py-1 rounded-full bg-red-500 text-white hover:bg-red-600 transition text-sm"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="ml-2 px-4 py-1 rounded-full bg-[#129990] text-white hover:bg-opacity-90 transition text-sm"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-[#129990] focus:outline-none"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow">
          <div className="px-4 py-3 flex flex-col gap-2">
            <Link href="/" className="py-2 hover:text-[#129990] transition" onClick={() => setMenuOpen(false)}>Beranda</Link>
            <Link href="/products" className="py-2 hover:text-[#129990] transition" onClick={() => setMenuOpen(false)}>Produk</Link>
            <Link href="/public-umkms" className="py-2 hover:text-[#129990] transition" onClick={() => setMenuOpen(false)}>UMKM</Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="py-2 hover:text-[#129990] transition" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/profile" className="py-2 hover:text-[#129990] transition" onClick={() => setMenuOpen(false)}>Profil</Link>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="w-full text-left py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 transition text-sm mt-2"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="w-full text-left py-2 px-4 rounded bg-[#129990] text-white hover:bg-opacity-90 transition text-sm mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
