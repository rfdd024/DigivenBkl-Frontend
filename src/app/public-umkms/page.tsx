"use client";

import React from "react";
import { useAppContext } from "@/context/AppContext"; // Perbaikan impor
import Link from "next/link";
import Navbar from "@/components/Navbar"; // Perbaikan impor
import Footer from "@/components/Footer"; // Perbaikan impor
import Image from "next/image";
import Loading from "@/components/Loading";
import { assets } from "@/assets/assets"; // Perbaikan impor

const PublicUmkmsPage = () => {
  const { umkms } = useAppContext();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (umkms.length > 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [umkms.length]);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <div className="flex flex-col items-center mb-8"> {/* Container untuk judul */}
          <p className="text-3xl font-medium">Daftar UMKM Bengkulu</p>
          <div className="w-28 h-0.5 bg-[#129990] mt-2"></div>
        </div>

        {loading ? (
          <Loading />
        ) : umkms.length === 0 ? (
          <p className="text-center text-gray-500 mt-12">Tidak ada UMKM yang terdaftar saat ini.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-14 mt-12 md:px-14 px-4"> {/* Menyesuaikan grid layout */}
            {umkms.map((umkm) => (
              <div key={umkm.id} className="relative group rounded-lg overflow-hidden">
                {/* Menggunakan foto profil UMKM sebagai gambar utama */}
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
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default PublicUmkmsPage;
