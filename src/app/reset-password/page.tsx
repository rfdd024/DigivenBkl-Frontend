"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { assets } from "@/assets/assets";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import toast from 'react-hot-toast';
import Image from "next/image";

const ResetPasswordPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { backendApiUrl } = useAppContext();

  const [token, setToken] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setStatus('error');
      setMessage('Token reset kata sandi tidak ditemukan di URL. Silakan kembali ke halaman lupa kata sandi.'); // More helpful message
      toast.error('Token reset kata sandi tidak ditemukan.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    if (!token) {
      setMessage('Token reset kata sandi tidak valid.');
      toast.error('Token reset kata sandi tidak valid.');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Kata sandi baru tidak cocok dengan konfirmasi kata sandi.');
      toast.error('Kata sandi baru tidak cocok.');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) { // Minimal 6 karakter
        setMessage('Kata sandi baru minimal 6 karakter.');
        toast.error('Kata sandi terlalu pendek.');
        setLoading(false);
        return;
    }

    try {
      const response = await fetch(`${backendApiUrl}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage(data.message || 'Kata sandi Anda berhasil direset!');
        toast.success(data.message || 'Kata sandi berhasil direset!');
      } else {
        setStatus('error');
        setMessage(data.error || 'Gagal mereset kata sandi. Pastikan link tidak kadaluarsa.'); // More specific error
        toast.error(data.error || 'Gagal mereset kata sandi.');
      }
    } catch (error) {
      console.error('Network or server error:', error);
      setStatus('error');
      setMessage('Gagal terhubung ke server. Silakan coba lagi.');
      toast.error('Gagal terhubung ke server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f5] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-8 border border-gray-100 text-center">
          <div className="flex flex-col items-center">
            <Image src={assets.logo} alt="Logo" width={72} height={72} className="mb-4" />
            {status === 'idle' && !token && (
              <p className="text-lg text-gray-600 mb-4">Memuat...</p>
            )}
            {status === 'success' ? (
              <>
                <Image src={assets.checkmark} alt="Success" width={96} height={96} className="mx-auto mb-6" /> 
                <h2 className="mt-0 text-3xl font-extrabold tracking-tight text-gray-900">
                  Reset Kata Sandi Berhasil!
                </h2>
                <p className="text-lg text-gray-700 mt-2">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-6 btn-auth px-6 py-2"
                >
                  Kembali ke Login
                </button>
              </>
            ) : (
              <>
                <h2 className="mt-0 text-3xl font-extrabold tracking-tight text-gray-900">
                  {status === 'error' ? 'Reset Gagal' : 'Atur Ulang Kata Sandi Anda'}
                </h2>
                <p className={`mt-2 text-base ${status === 'error' ? 'text-red-600' : 'text-gray-600'}`}>
                  {message || "Masukkan kata sandi baru Anda di bawah ini."}
                </p>
                {status !== 'error' && token && (
                  <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="">
                      <div>
                        <input
                          id="new-password"
                          name="newPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="input-auth"
                          placeholder="Kata Sandi Baru (minimal 6 karakter)"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div>
                        <input
                          id="confirm-password"
                          name="confirmPassword"
                          type="password"
                          autoComplete="new-password"
                          required
                          className="input-auth mt-4"
                          placeholder="Konfirmasi Kata Sandi Baru"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div>
                      <button
                        type="submit"
                        className="btn-auth"
                        disabled={loading}
                      >
                        {loading ? 'Mereset...' : 'Reset Kata Sandi'}
                      </button>
                    </div>
                    <div className="text-center text-sm mt-4">
                      <button
                          type="button"
                          onClick={() => router.push('/login')}
                          className="font-bold text-[#129990] hover:underline"
                      >
                          Kembali ke Login
                      </button>
                    </div>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        .input-auth {
          @apply w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#129990] focus:ring-2 focus:ring-[#129990]/20 outline-none transition duration-200 ease-in-out text-gray-800 placeholder-gray-500;
        }
        .btn-auth {
          @apply w-full py-3 rounded-xl bg-[#129990] text-white font-bold hover:bg-[#0e7c7a] transition duration-200 ease-in-out shadow-md hover:shadow-lg;
        }
      `}</style>
    </>
  );
};

export default ResetPasswordPage;
