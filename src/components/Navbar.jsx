"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import { assets } from "@/assets/assets";

const Navbar = () => {
  const { isAuthenticated, userProfile, logout, router } = useAppContext();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white shadow sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <div className="flex items-center gap-2 w-1/3">
            <Link href="/" className="flex items-center gap-2 cursor-pointer">
              <Image
                src={assets.logo}
                alt="Logo"
                width={36}
                height={36}
                className="object-contain"
                unoptimized
              />
              <span className="font-bold text-[#129990] text-lg">UMKM Bengkulu</span>
            </Link>
          </div>

          {/* Center: Navigation */}
          <div className="hidden md:flex justify-center gap-10 items-center w-1/3">
            <Link href="/" className="hover:text-[#129990] transition cursor-pointer">Beranda</Link>
            <Link href="/products" className="hover:text-[#129990] transition cursor-pointer">Produk</Link>
            <Link href="/public-umkms" className="hover:text-[#129990] transition cursor-pointer">UMKM</Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="hover:text-[#129990] transition cursor-pointer">Dashboard</Link>
                <Link href="/dashboard/profile" className="hover:text-[#129990] transition cursor-pointer">Profil</Link>
              </>
            )}
          </div>

          {/* Right: User Dropdown */}
          <div className="relative hidden md:flex items-center justify-end w-1/3" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="flex items-center gap-1 hover:text-[#096B68] transition cursor-pointer"
            >
              <Image
                src={assets.user_icon}
                alt="user icon"
                width={22}
                height={22}
                className="w-5 h-5"
              />
              <svg
                className={`w-4 h-4 transform transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : "rotate-0"
                }`}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-10 w-36 bg-white text-[#096B68] rounded shadow-lg z-20">
                {isAuthenticated ? (
                  <>
                    <Link
                      href="/dashboard/profile"
                      className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                      onClick={() => setShowDropdown(false)}
                    >
                      Profil
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="block px-4 py-2 hover:bg-gray-100 text-sm text-left w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                    onClick={() => setShowDropdown(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile Only */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md text-gray-700 hover:text-[#129990] focus:outline-none cursor-pointer"
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
            <Link href="/" className="py-2 text-center hover:text-[#129990] transition cursor-pointer" onClick={() => setMenuOpen(false)}>Beranda</Link>
            <Link href="/products" className="py-2 text-center hover:text-[#129990] transition cursor-pointer" onClick={() => setMenuOpen(false)}>Produk</Link>
            <Link href="/public-umkms" className="py-2 text-center hover:text-[#129990] transition cursor-pointer" onClick={() => setMenuOpen(false)}>UMKM</Link>
            {isAuthenticated && (
              <>
                <Link href="/dashboard" className="py-2 text-center hover:text-[#129990] transition cursor-pointer" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link href="/dashboard/profile" className="py-2 text-center hover:text-[#129990] transition cursor-pointer" onClick={() => setMenuOpen(false)}>Profil</Link>
                <button
                  onClick={() => { setMenuOpen(false); logout(); }}
                  className="w-full text-center py-2 px-4 rounded bg-red-500 text-white hover:bg-red-600 transition text-sm mt-2"
                >
                  Logout
                </button>
              </>
            )}
            {!isAuthenticated && (
              <Link
                href="/login"
                className="w-full text-center py-2 px-4 rounded bg-[#129990] text-white hover:bg-opacity-90 transition text-sm mt-2"
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
