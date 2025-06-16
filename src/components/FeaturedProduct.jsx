// Tambahkan jarak di bagian bawah komponen agar tidak terlalu mepet
// Update ini diletakkan setelah grid UMKM atau teks 'Tidak tersedia'

"use client";

import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useAppContext } from "@/context/AppContext";
import Loading from "./Loading";

const FeaturedProduct = () => {
  const { umkms } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, [umkms.length]);

  if (loading) return <Loading />;

  const featuredUmkms = umkms.slice(0, 3);

  return (
    <div className="mt-14">
      <div className="flex flex-col items-center">
        <p className="text-3xl font-medium">UMKM Unggulan</p>
        <div className="w-28 h-0.5 bg-[#129990] mt-2"></div>
      </div>

      {featuredUmkms.length === 0 ? (
        <>
          <p className="text-center text-gray-500 mt-12">
            Tidak ada UMKM unggulan yang tersedia saat ini.
          </p>
          <div className="mb-20" /> {/* Tambahkan jarak bawah saat tidak ada UMKM */}
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4">
            {featuredUmkms.map((umkm) => (
              <div key={umkm.id} className="relative group rounded-lg overflow-hidden">
                <Image
                  src={umkm.foto_profil_umkm || assets.placeholder_image}
                  alt={umkm.nama_perusahaan_umkm || "Profil UMKM"}
                  width={800}
                  height={500}
                  className="group-hover:brightness-75 transition duration-300 w-full h-auto object-cover"
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.src = assets.placeholder_image;
                  }}
                />
                <div className="group-hover:-translate-y-4 transition duration-300 absolute bottom-8 left-8 text-white space-y-2">
                  <p className="font-medium text-xl lg:text-2xl">
                    {umkm.nama_perusahaan_umkm}
                  </p>
                  <p className="text-sm lg:text-base leading-5 max-w-60">
                    Oleh: {umkm.nama_pelaku} <br />
                    {umkm.lokasi_perusahaan_umkm ? `Lokasi: ${umkm.lokasi_perusahaan_umkm}` : ""}
                  </p>
                  {umkm.username ? (
                    <Link
                      href={`/umkms/${umkm.username}`}
                      className="flex items-center gap-1.5 bg-[#129990] px-4 py-2 rounded"
                    >
                      Kunjungi Toko
                      <Image className="h-3 w-3" src={assets.redirect_icon} alt="Redirect Icon" />
                    </Link>
                  ) : (
                    <span className="flex items-center gap-1.5 bg-gray-500 px-4 py-2 rounded text-white cursor-not-allowed">
                      Toko Tidak Tersedia
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mb-32" />
        </>
      )}
    </div>
  );
};

export default FeaturedProduct;