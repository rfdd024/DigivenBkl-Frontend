"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { assets } from '@/assets/assets';

const UmkmProfilePage = () => {
  const router = useRouter();
  const { isAuthenticated, initialized, jwtToken, userProfile, backendApiUrl, setUserProfile, logout } = useAppContext();

  // State untuk form input teks
  const [namaPelaku, setNamaPelaku] = useState('');
  const [namaPerusahaanUmkm, setNamaPerusahaanUmkm] = useState('');
  const [username, setUsername] = useState('');
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [lokasiPerusahaanUmkm, setLokasiPerusahaanUmkm] = useState('');
  const [jamOperasional, setJamOperasional] = useState('');

  // State untuk URL gambar
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [bannerImageUrls, setBannerImageUrls] = useState<string[]>([]);

  const [loadingPage, setLoadingPage] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!initialized) {
      return;
    }

    if (!isAuthenticated) {
      toast.error('Anda harus login untuk mengakses halaman profil.');
      router.push('/login');
    }
  }, [initialized, isAuthenticated, router]);

  // Ambil data profil UMKM
  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated || !jwtToken || !userProfile?.id) {
      setLoadingPage(false);
      return;
    }

    setLoadingPage(true);
    setError(null);
    try {
      const response = await fetch(`${backendApiUrl}/umkm/profile`, {
        headers: { 'Authorization': `Bearer ${jwtToken}` },
      });

      if (!response.ok) {
        if (response.status === 403) {
          toast.error('Sesi Anda telah berakhir atau belum terverifikasi. Mohon login kembali.');
          logout();
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengambil profil UMKM.');
      }

      const data = await response.json();
      const profileData = data.umkm;

      setNamaPelaku(profileData.nama_pelaku || '');
      setNamaPerusahaanUmkm(profileData.nama_perusahaan_umkm || '');
      setUsername(profileData.username || '');
      setNomorWhatsapp(profileData.nomor_whatsapp || '');
      setLokasiPerusahaanUmkm(profileData.lokasi_perusahaan_umkm || '');
      setJamOperasional(profileData.jam_operasional || '');

      setProfileImageUrl(profileData.foto_profil_umkm || '');
      setBannerImageUrls(Array.isArray(profileData.foto_banner_umkm) ? profileData.foto_banner_umkm : []);

      setUserProfile(profileData);

    } catch (err: unknown) {
      console.error('Error saat fetch profile:', err);
      if (err instanceof Error) setError(err.message);
      else setError('Terjadi kesalahan tak terduga.');
    } finally {
      setLoadingPage(false);
    }
  }, [isAuthenticated, jwtToken, userProfile?.id, backendApiUrl, setUserProfile, logout]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handler untuk perubahan URL gambar profil
  const handleProfileImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileImageUrl(e.target.value);
  };

  // Handler untuk perubahan URL gambar banner (dipisah koma)
  const handleBannerImageUrlsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const urls = e.target.value.split(',').map(url => url.trim()).filter(Boolean);
    setBannerImageUrls(urls);
  };

  // Submit profil (kirim JSON, bukan FormData)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    if (!isAuthenticated || !jwtToken || !userProfile?.id) {
      toast.error('Anda tidak terautentikasi.');
      setLoadingSubmit(false);
      return;
    }

    try {
      const body = {
        nama_pelaku: namaPelaku,
        nama_perusahaan_umkm: namaPerusahaanUmkm,
        nomor_whatsapp: nomorWhatsapp,
        lokasi_perusahaan_umkm: lokasiPerusahaanUmkm,
        jam_operasional: jamOperasional,
        foto_profil_umkm: profileImageUrl,
        foto_banner_umkm: bannerImageUrls,
      };

      const response = await fetch(`${backendApiUrl}/umkm/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Profil berhasil diperbarui!');
        setUserProfile(data.umkm);
        await fetchProfile();
      } else {
        setError(data.error || 'Gagal memperbarui profil.');
        toast.error(data.error || 'Gagal memperbarui profil.');
      }
    } catch (err: unknown) {
      console.error('Error jaringan atau server:', err);
      setError('Gagal terhubung ke server. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (!isAuthenticated || loadingPage) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh] text-red-600">
          <p>Error: {error}. Mohon refresh halaman atau coba lagi nanti.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">Profil UMKM Anda</h1>
          <p className="text-lg text-gray-700 text-center mb-8">
            Perbarui detail toko Anda agar pembeli dapat menemukan dan menghubungi Anda dengan mudah.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Foto Profil */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#129990] shadow-lg mb-4">
                <Image
                  src={profileImageUrl || assets.placeholder_image}
                  alt="Foto Profil"
                  width={128}
                  height={128}
                  className="object-cover w-full h-full"
                  unoptimized
                  onError={(e) => { e.currentTarget.src = assets.placeholder_image; }}
                />
              </div>
              <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700 mb-2">URL Foto Profil UMKM:</label>
              <input
                type="url"
                id="profileImageUrl"
                className="w-full text-gray-800 border border-gray-300 rounded-lg p-2"
                value={profileImageUrl}
                onChange={handleProfileImageUrlChange}
                placeholder="https://..."
              />
            </div>

            {/* Foto Banner */}
            <div className="mb-6">
              <label htmlFor="bannerImageUrls" className="block text-sm font-medium text-gray-700 mb-2">
                URL Foto Banner UMKM (maks. 5, pisahkan dengan koma):
              </label>
              <input
                type="text"
                id="bannerImageUrls"
                className="w-full text-gray-800 border border-gray-300 rounded-lg p-2"
                value={bannerImageUrls.join(', ')}
                onChange={handleBannerImageUrlsChange}
                placeholder="https://img1.jpg, https://img2.jpg"
              />
              {bannerImageUrls.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {bannerImageUrls.map((url, index) => (
                    url && (
                      <div key={`banner-${index}`} className="relative">
                        <Image
                          src={url}
                          alt={`Banner ${index + 1}`}
                          width={100}
                          height={60}
                          objectFit="cover"
                          className="rounded-md border border-gray-200"
                          unoptimized
                          onError={(e) => { e.currentTarget.src = assets.placeholder_image; }}
                        />
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Bidang Form lainnya */}
            <div>
              <label htmlFor="namaPerusahaanUmkm" className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan UMKM:</label>
              <input
                type="text"
                id="namaPerusahaanUmkm"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={namaPerusahaanUmkm}
                onChange={(e) => setNamaPerusahaanUmkm(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="namaPelaku" className="block text-sm font-medium text-gray-700 mb-1">Nama Pelaku UMKM:</label>
              <input
                type="text"
                id="namaPelaku"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={namaPelaku}
                onChange={(e) => setNamaPelaku(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username (Tidak dapat diubah):</label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gray-100 text-gray-600 cursor-not-allowed"
                value={username}
                readOnly
                disabled
              />
            </div>
            <div>
              <label htmlFor="nomorWhatsapp" className="block text-sm font-medium text-gray-700 mb-1">Nomor WhatsApp:</label>
              <input
                type="text"
                id="nomorWhatsapp"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={nomorWhatsapp}
                onChange={(e) => setNomorWhatsapp(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="lokasiPerusahaanUmkm" className="block text-sm font-medium text-gray-700 mb-1">Link Lokasi Perusahaan (URL Google Maps/lainnya):</label>
              <input
                type="url"
                id="lokasiPerusahaanUmkm"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={lokasiPerusahaanUmkm}
                onChange={(e) => setLokasiPerusahaanUmkm(e.target.value)}
                placeholder="https://maps.app.goo.gl/..."
              />
            </div>
            <div>
              <label htmlFor="jamOperasional" className="block text-sm font-medium text-gray-700 mb-1">Jam Operasional (contoh: Senin-Jumat, 09:00-17:00):</label>
              <input
                type="text"
                id="jamOperasional"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={jamOperasional}
                onChange={(e) => setJamOperasional(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#129990] text-white font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UmkmProfilePage;