"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Image from "next/image";
import { assets } from "@/assets/assets";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const { backendApiUrl } = useAppContext();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${backendApiUrl}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Jika email Anda terdaftar, link reset password telah dikirimkan.');
        toast.success(data.message || 'Permintaan berhasil dikirim!');
        setEmail(''); // Clear email field
      } else {
        setMessage(data.error || 'Gagal mengirim permintaan.');
        toast.error(data.error || 'Permintaan gagal.');
      }
    } catch (error) {
      console.error('Network or server error:', error);
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
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-8 border border-gray-100">
          <div className="flex flex-col items-center">
            <Image src={assets.logo} alt="Logo" width={72} height={72} className="mb-4" />
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">
              Lupa Kata Sandi?
            </h2>
            <p className="text-gray-600 text-base text-center">
              Masukkan email Anda dan kami akan mengirimkan link untuk mereset kata sandi Anda.
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="">
              <div>
                <input
                  id="email-forgot"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="input-auth"
                  placeholder="Alamat Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn-auth"
                disabled={loading}
              >
                {loading ? 'Mengirim...' : 'Kirim Link Reset Kata Sandi'}
              </button>
            </div>
            {message && <p className="mt-4 text-center text-sm text-gray-600">{message}</p>}
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

export default ForgotPasswordPage;