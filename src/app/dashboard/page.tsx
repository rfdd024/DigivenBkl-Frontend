"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import Link from 'next/link';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { isAuthenticated, userProfile, initialized } = useAppContext();
  const router = useRouter();

  // Tunggu context siap sebelum cek login
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Anda harus login untuk mengakses dashboard.');
      router.push('/login');
    }
  }, [initialized, isAuthenticated, router]);

  // Tampilkan loading saat context belum siap
  if (!initialized) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  // Tampilkan loading jika userProfile belum siap (opsional)
  if (!userProfile) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-2 sm:px-4 md:px-8 lg:px-16">
        <div className="mx-auto bg-white rounded-lg shadow-xl
    p-4 sm:p-8 lg:p-12
    max-w-full sm:max-w-2xl md:max-w-3xl lg:max-w-4xl
    ">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-8 text-center">
            Selamat Datang, <span className="text-[#129990]">{userProfile.nama_perusahaan_umkm}</span>!
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-10">
            <div className="bg-blue-50 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full max-w-xs mx-auto transition-transform hover:scale-105 hover:bg-blue-100">
              <span className="text-5xl mb-4" role="img" aria-label="profile">👤</span>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Profil UMKM</h2>
              <p className="text-gray-600 mb-4">Perbarui informasi dasar toko dan kontak Anda.</p>
              <Link href="/dashboard/profile" className="px-5 py-2 bg-[#129990] text-white rounded-full font-medium hover:bg-opacity-90 transition">
                Lihat/Edit Profil
              </Link>
            </div>

            <div className="bg-green-50 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full max-w-xs mx-auto transition-transform hover:scale-105 hover:bg-green-100">
              <span className="text-5xl mb-4" role="img" aria-label="products">📦</span>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Manajemen Produk</h2>
              <p className="text-gray-600 mb-4">Tambahkan, edit, atau hapus produk Anda.</p>
              <Link href="/dashboard/products" className="px-5 py-2 bg-[#129990] text-white rounded-full font-medium hover:bg-opacity-90 transition">
                Kelola Produk
              </Link>
            </div>

            <div className="bg-purple-50 p-4 sm:p-6 rounded-lg shadow-md flex flex-col items-center text-center w-full max-w-xs mx-auto transition-transform hover:scale-105 hover:bg-purple-100">
              <span className="text-5xl mb-4" role="img" aria-label="feedback">💬</span>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Ulasan Produk</h2>
              <p className="text-gray-600 mb-4">Lihat feedback dan rating dari pembeli.</p>
              <Link href="/dashboard/feedback" className="px-5 py-2 bg-[#129990] text-white rounded-full font-medium hover:bg-opacity-90 transition">
                Lihat Ulasan
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default DashboardPage;
