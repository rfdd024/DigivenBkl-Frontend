"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets"; // Perbaikan impor
import Image from "next/image";
import Link from "next/link"; // Import Link untuk navigasi
import { useAppContext } from "@/context/AppContext"; // Import context
import Loading from "./Loading"; // Impor komponen Loading

const FeaturedProduct = () => {
  const { umkms } = useAppContext(); // Ambil data UMKM dari context
  const [loading, setLoading] = useState(true); // State untuk loading
  
  // Menggunakan useEffect untuk menangani state loading berdasarkan data umkms
  useEffect(() => {
    if (umkms.length > 0) {
      setLoading(false);
    } else {
      // Jika AppContext sudah selesai mengambil data dan tidak ada UMKM,
      // atau jika masih menunggu, kita set loading false untuk tidak stuck
      setLoading(false); 
    }
  }, [umkms.length]); // Bergantung pada perubahan panjang array umkms

  if (loading) {
    return <Loading />; // Tampilkan komponen Loading
  }

  // Ambil beberapa UMKM teratas untuk ditampilkan sebagai unggulan
  // Anda bisa menyesuaikan jumlahnya (misalnya 3, 4, atau 6)
  const featuredUmkms = umkms.slice(0, 3); 

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">UMKM Unggulan</p> {/* Mengubah judul */}
        <div className="w-28 h-0.5 bg-[#129990] mt-2"></div>
      </div>

      {featuredUmkms.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">Tidak ada UMKM unggulan yang tersedia saat ini.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
          {featuredUmkms.map((umkm) => (
            <div key={umkm.id} className="relative group rounded-lg overflow-hidden">
              {/* Menggunakan foto profil UMKM sebagai gambar */}
              <Image
                src={umkm.foto_profil_umkm || assets.placeholder_image} // Fallback ke placeholder
                alt={umkm.nama_perusahaan_umkm || 'Profil UMKM'}
                width={800} // Sesuaikan lebar/tinggi agar terlihat baik
                height={500}
                className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
                unoptimized // Tambahkan unoptimized untuk URL eksternal
                onError={(e) => {
                  e.currentTarget.src = assets.placeholder_image; // Fallback jika gambar error
                }}
              />
              <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                <p className="font-medium text-xl lg:text-2xl">{umkm.nama_perusahaan_umkm}</p> {/* Nama Perusahaan */}
                <p className="text-sm lg:text-base leading-5 max-w-60">
                  Oleh: {umkm.nama_pelaku} <br /> {/* Nama Pelaku */}
                  {umkm.lokasi_perusahaan_umkm ? `Lokasi: ${umkm.lokasi_perusahaan_umkm}` : ''}
                </p>
                {/* Pastikan username ada sebelum membuat tautan */}
                {umkm.username ? (
                  <Link href={`/umkms/${umkm.username}`} className="flex items-center gap-1.5 bg-[#129990] px-4 py-2 rounded">
                    Kunjungi Toko <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                  </Link>
                ) : (
                  <span className="flex items-center gap-1.5 bg-gray-500 px-4 py-2 rounded text-white cursor-not-allowed">
                    Toko Tidak Tersedia
                  </span>
                )}
              </div>
            </div>
          ))}
            <div className="flex justify-center col-span-full">
                <Link href="/public-umkms" className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    Lihat Semua UMKM
                </Link>
            </div>
        </div>
      )}
    </div>
  );
};

export default FeaturedProduct;
