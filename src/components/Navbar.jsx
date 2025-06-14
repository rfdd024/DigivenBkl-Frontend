"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const { isAuthenticated, isSeller, logout } = useAppContext();

  // Fungsi untuk menangani logout
  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <Image
        className="cursor-pointer w-20 md:w-22"
        onClick={() => router.push('/')}
        src={assets.logo}
        alt="UMKM Bengkulu Logo"
        priority // Tambahkan priority untuk logo
      />
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/public-umkms" className="hover:text-gray-900 transition">
          Daftar UMKM
        </Link>
        <Link href="/products" className="hover:text-gray-900 transition">
          Produk
        </Link>

        {isSeller && (
          <button
            onClick={() => router.push('/dashboard')}
            className="text-xs border px-4 py-1.5 rounded-full hover:bg-gray-100 transition bg-[#129990] text-white"
          >
            Dashboard UMKM
          </button>
        )}
      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        {/* Ikon pencarian, biarkan jika ada fitur pencarian */}
        <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />

        {!isAuthenticated ? (
          <Link href="/login" className="flex items-center bg-[#129990] px-4 py-1.5 rounded-full gap-2 text-white hover:opacity-90 transition">
            <Image src={assets.user_icon} alt="user icon" className="w-4 h-4" />
            Daftar / Login
          </Link>
        ) : (
          <>
            <Link href={isSeller ? '/dashboard' : '/user-profile'} className="flex items-center gap-2 hover:text-gray-900 transition">
              <Image src={assets.user_icon} alt="user icon" className="w-4 h-4"/>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs border px-4 py-1.5 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              style={{ cursor: 'pointer' }}
            >
              Logout
            </button>
          </>
        )}
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && (
          <button onClick={() => router.push('/dashboard')} className="text-xs border px-4 py-1.5 rounded-full bg-[#129990] text-white">
            Dashboard UMKM
          </button>
        )}
        {!isAuthenticated ? (
          <Link href="/login" className="flex items-center bg-[#129990] px-4 py-1.5 rounded-full gap-2 text-white">
            <Image src={assets.user_icon} alt="user icon" className="w-4 h-4"/>
            Daftar
          </Link>
        ) : (
          <button onClick={handleLogout} className="text-xs border px-4 py-1.5 rounded-full bg-red-500 text-white" style={{ cursor: 'pointer' }}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
