"use client";

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Loading from '@/components/Loading';
import toast from 'react-hot-toast';
import Image from 'next/image';
import { assets } from "@/assets/assets";

const VerifyEmailPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { backendApiUrl } = useAppContext();

  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Memverifikasi email Anda...');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setVerificationStatus('error');
      setMessage('Token verifikasi tidak ditemukan. Silakan coba kembali dari halaman pendaftaran atau kirim ulang verifikasi email.'); // More helpful message
      toast.error('Token verifikasi tidak ditemukan.');
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`${backendApiUrl}/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (response.ok) {
          setVerificationStatus('success');
          setMessage(data.message || 'Email Anda berhasil diverifikasi! Sekarang Anda bisa login.'); // Added instruction
          toast.success(data.message || 'Email Anda berhasil diverifikasi!');
        } else {
          setVerificationStatus('error');
          setMessage(data.error || 'Gagal memverifikasi email. Link mungkin sudah kadaluarsa atau tidak valid.'); // More specific error
          toast.error(data.error || 'Gagal memverifikasi email.');
        }
      } catch (err: unknown) {
        setVerificationStatus('error');
        setMessage('Terjadi kesalahan jaringan atau server. Silakan coba lagi nanti.');
        toast.error('Terjadi kesalahan jaringan atau server.');
        console.error('Error verifying email:', err);
      }
    };

    verifyEmail();
  }, [searchParams, backendApiUrl]);

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f5] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-8 border border-gray-100 text-center">
          <div className="flex flex-col items-center">
            <Image src={assets.logo} alt="Logo" width={72} height={72} className="mb-4" />
            {verificationStatus === 'loading' && (
              <>
                <Loading />
                <p className="text-lg text-gray-600 mt-4">{message}</p>
              </>
            )}
            {verificationStatus === 'success' && (
              <>
                <Image src={assets.checkmark} alt="Success" width={96} height={96} className="mx-auto mb-6" />
                <h2 className="mt-0 text-3xl font-extrabold tracking-tight text-gray-900">
                  Verifikasi Berhasil!
                </h2>
                <p className="text-lg text-gray-700 mt-2">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-6 btn-auth px-6 py-2"
                >
                  Kembali ke Login
                </button>
              </>
            )}
            {verificationStatus === 'error' && (
              <>
                <Image src={assets.error_icon} alt="Error" width={96} height={96} className="mx-auto mb-6" />
                <h2 className="mt-0 text-3xl font-extrabold tracking-tight text-red-600">
                  Verifikasi Gagal
                </h2>
                <p className="text-lg text-red-700 mt-2">{message}</p>
                <button
                  onClick={() => router.push('/login')}
                  className="mt-6 px-6 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition duration-200 ease-in-out shadow-md hover:shadow-lg"
                >
                  Coba Lagi (Kembali ke Login)
                </button>
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

export default VerifyEmailPage;