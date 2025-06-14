"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';

const UpdatePasswordPage = () => {
  const { isAuthenticated, jwtToken, backendApiUrl, initialized } = useAppContext();
  const router = useRouter();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect jika tidak terautentikasi, tapi tunggu context siap
  useEffect(() => {
    if (initialized && !isAuthenticated) {
      toast.error('Anda harus login untuk mengakses halaman ini.');
      router.push('/login');
    }
  }, [initialized, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingSubmit(true);
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
      toast.error('Kata sandi baru dan konfirmasi kata sandi tidak cocok.');
      setLoadingSubmit(false);
      return;
    }

    if (!isAuthenticated || !jwtToken) {
      toast.error('Anda tidak terautentikasi.');
      setLoadingSubmit(false);
      return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/umkm/update-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwtToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Kata sandi berhasil diperbarui!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        setError(data.error || 'Gagal memperbarui kata sandi.');
        toast.error(data.error || 'Gagal memperbarui kata sandi.');
      }
    } catch (err: unknown) {
      console.error('Error jaringan atau server:', err);
      setError('Gagal terhubung ke server. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server.');
    } finally {
      setLoadingSubmit(false);
    }
  };

  // Saat context belum siap, tampilkan loading
  if (!initialized) {
    return (
      <>
        <Navbar />
        <Loading />
        <Footer />
      </>
    );
  }

  // Setelah context siap, baru cek login
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Ubah Kata Sandi</h1>
          <p className="text-gray-700 text-center mb-8">
            Perbarui kata sandi akun Anda demi keamanan.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Saat Ini:</label>
              <input
                type="password"
                id="currentPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">Kata Sandi Baru:</label>
              <input
                type="password"
                id="newPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Kata Sandi Baru:</label>
              <input
                type="password"
                id="confirmNewPassword"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#129990] text-gray-800 transition-all duration-200"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#129990] text-white font-semibold text-lg hover:bg-opacity-90 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loadingSubmit}
            >
              {loadingSubmit ? 'Mengubah Kata Sandi...' : 'Ubah Kata Sandi'}
            </button>
            <div className="text-center text-sm mt-4">
              <a
                href="/forgot-password"
                className="font-bold text-[#129990] hover:underline"
              >
                Lupa Kata Sandi?
              </a>
            </div>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UpdatePasswordPage;
