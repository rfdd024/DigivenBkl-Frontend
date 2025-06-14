"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext'; // Perbaikan impor
import Navbar from '@/components/Navbar'; // Perbaikan impor
import Footer from '@/components/Footer'; // Perbaikan impor
import ProductCard from '@/components/ProductCard'; // Perbaikan impor
import Image from 'next/image';
import { assets } from '@/assets/assets'; // Perbaikan impor
import Loading from '@/components/Loading'; // Perbaikan impor

// Definisi tipe data untuk UMKM Store Detail
interface UmkmStoreType {
  umkm: {
    id: string;
    nama_perusahaan_umkm: string;
    username: string;
    nomor_whatsapp: string; // Ditambahkan
    nama_pelaku: string;
    foto_profil_umkm?: string;
    foto_banner_umkm?: string[];
    lokasi_perusahaan_umkm?: string;
    jam_operasional?: string;
  };
  products: Array<{
    id: string;
    nama_produk: string;
    deskripsi_produk: string;
    harga_produk: number;
    gambar_url: string[];
    created_at: string;
    average_rating?: number;
  }>;
}

const UmkmStorePage = () => {
  const { username } = useParams();
  const { backendApiUrl } = useAppContext();
  const [umkmStore, setUmkmStore] = useState<UmkmStoreType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentBannerImage, setCurrentBannerImage] = useState<number>(0); // Perbaikan: setCurrentImage -> setCurrentBannerImage

  useEffect(() => {
    if (username) {
      const fetchUmkmStore = async () => {
        setLoading(true);
        setError(null);
        try {
          // Memastikan username adalah string yang valid
          if (typeof username !== 'string') {
              throw new Error('Username tidak valid.');
          }

          const response = await fetch(`${backendApiUrl}/public/umkms/${username}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengambil data toko UMKM.');
          }
          const data = await response.json();
          setUmkmStore(data);
          setCurrentBannerImage(0);
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError('Terjadi kesalahan tak terduga.');
          }
        } finally {
          setLoading(false);
        }
      };
      fetchUmkmStore();
    }
  }, [username, backendApiUrl]);

  if (loading) {
    return (
      <>
        <Navbar />
        <Loading /> {/* Menggunakan komponen Loading */}
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-red-600">Error: {error}</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!umkmStore || !umkmStore.umkm) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-gray-600">Toko UMKM tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  const { umkm, products } = umkmStore;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        {/* Banner UMKM */}
        {umkm.foto_banner_umkm && umkm.foto_banner_umkm.length > 0 && (
          <div className="w-full h-64 md:h-96 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-8 relative">
            <Image
              src={umkm.foto_banner_umkm[currentBannerImage]}
              alt={`Banner ${umkm.nama_perusahaan_umkm || 'Toko UMKM'}`}
              layout="fill"
              objectFit="cover"
              className="w-full h-full"
              unoptimized
              onError={(e) => {
                  e.currentTarget.src = assets.placeholder_image;
              }}
            />
            {umkm.foto_banner_umkm.length > 1 && (
              <div className="absolute bottom-4 flex gap-2 bg-black/50 p-2 rounded-full">
                {umkm.foto_banner_umkm.map((imgUrl: string, index: number) => (
                  <div
                    key={imgUrl} // Perbaikan: Menggunakan imgUrl sebagai key
                    className={`h-2 w-2 rounded-full cursor-pointer ${
                      currentBannerImage === index ? 'bg-white' : 'bg-gray-400'
                    }`}
                    onClick={() => setCurrentBannerImage(index)}
                  ></div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Profil UMKM */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 flex flex-col md:flex-row items-center md:items-start gap-6">
          {umkm.foto_profil_umkm ? (
            <Image
              src={umkm.foto_profil_umkm}
              alt={umkm.nama_perusahaan_umkm || 'Foto Profil UMKM'}
              width={128} // w-32
              height={128} // h-32
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md -mt-20 md:mt-0"
              unoptimized
              onError={(e) => {
                  e.currentTarget.src = assets.placeholder_image;
              }}
            />
          ) : (
            <Image
              src={assets.placeholder_image} // Placeholder jika tidak ada foto profil
              alt="Placeholder Profil UMKM"
              width={128}
              height={128}
              className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md -mt-20 md:mt-0"
              unoptimized
            />
          )}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{umkm.nama_perusahaan_umkm}</h1>
            <p className="text-md text-gray-600 mb-1">Oleh: {umkm.nama_pelaku}</p>
            <p className="text-md text-gray-600 mb-4">Username: {umkm.username}</p>
            {umkm.nomor_whatsapp && (
              <p className="text-gray-700 mb-2">
                <span className="font-medium">WhatsApp:</span> {umkm.nomor_whatsapp}
              </p>
            )}
            {umkm.lokasi_perusahaan_umkm && (
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Lokasi:</span>{" "}
                <a href={umkm.lokasi_perusahaan_umkm} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  Lihat di Peta
                </a>
              </p>
            )}
            {umkm.jam_operasional && (
              <p className="text-gray-700">
                <span className="font-medium">Jam Operasional:</span> {umkm.jam_operasional}
              </p>
            )}
          </div>
        </div>

        {/* Daftar Produk UMKM */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Produk dari {umkm.nama_perusahaan_umkm}</h2>
          {products && products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">UMKM ini belum memiliki produk.</p>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UmkmStorePage;
