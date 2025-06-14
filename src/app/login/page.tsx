"use client";

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAppContext } from '@/context/AppContext';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { assets } from "@/assets/assets";
import Image from "next/image";

const LoginPage = () => {
  const router = useRouter();
  const { login, backendApiUrl } = useAppContext();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password' | 'resend-verification'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [namaPelaku, setNamaPelaku] = useState('');
  const [namaPerusahaanUmkm, setNamaPerusahaanUmkm] = useState('');
  const [nomorWhatsapp, setNomorWhatsapp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let url = '';
    let body: Record<string, unknown> = {};
    let successMessage = '';
    let errorMessage = '';

    try {
      if (mode === 'login') {
        url = `${backendApiUrl}/auth/login`;
        body = { email, password };
        successMessage = 'Login Berhasil!';
        errorMessage = 'Kredensial tidak valid atau email belum diverifikasi.';
      } else if (mode === 'register') {
        url = `${backendApiUrl}/auth/register`;
        body = { email, password, nama_pelaku: namaPelaku, nama_perusahaan_umkm: namaPerusahaanUmkm, nomor_whatsapp: nomorWhatsapp };
        successMessage = 'Registrasi berhasil! Silakan cek email Anda untuk verifikasi.';
        errorMessage = 'Registrasi gagal.';
      } else if (mode === 'forgot-password') {
        url = `${backendApiUrl}/auth/forgot-password`;
        body = { email };
        successMessage = 'Jika email Anda terdaftar, link reset password telah dikirimkan.';
        errorMessage = 'Gagal mengirim permintaan reset password.';
      } else if (mode === 'resend-verification') {
        url = `${backendApiUrl}/auth/resend-verification-email`;
        body = { email };
        successMessage = 'Email verifikasi baru telah dikirim. Silakan cek kotak masuk Anda.';
        errorMessage = 'Gagal mengirim ulang email verifikasi.';
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || successMessage);
        if (mode === 'login') {
            login(data.token, data.umkm_profile);
            router.push('/'); // Redirect to homepage or dashboard after successful login
        } else if (mode === 'register') {
            setMode('login'); // Setelah register, kembali ke form login
            setEmail('');
            setPassword('');
            setNamaPelaku('');
            setNamaPerusahaanUmkm('');
            setNomorWhatsapp('');
        } else if (mode === 'forgot-password' || mode === 'resend-verification') {
            setEmail('');
            setMode('login'); // Kembali ke form login setelah permintaan
        }
      } else {
        toast.error(data.error || errorMessage);
      }
    } catch (error) {
      console.error('Network or server error:', error);
      toast.error('Gagal terhubung ke server. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  const renderFormContent = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div>
              <input
                id="email-address"
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
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="input-auth"
                placeholder="Kata Sandi"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Memproses...' : 'Login'}
            </button>
            <div className="flex flex-col gap-2 mt-2 text-center"> {/* Added text-center */}
              <button
                type="button"
                onClick={() => setMode('forgot-password')}
                className="text-[#129990] hover:underline text-sm font-medium" // Added font-medium
              >
                Lupa Kata Sandi ?
              </button>
              <button
                type="button"
                onClick={() => setMode('resend-verification')}
                className="text-[#129990] hover:underline text-sm font-medium" // Added font-medium
              >
                Tidak dapat Email Verifikasi ?
              </button>
            </div>
            <div className="text-center text-sm mt-4"> {/* Increased mt to 4 */}
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#129990] hover:underline font-bold" // Changed font-medium to font-bold for more emphasis
              >
                Daftar di sini
              </button>
            </div>
          </>
        );
      case 'register':
        return (
          <>
            <div>
              <input
                id="email-address-reg"
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
            <div>
              <input
                id="password-reg"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="input-auth"
                placeholder="Kata Sandi (minimal 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <input
                id="nama-pelaku-reg"
                name="nama-pelaku"
                type="text"
                required
                className="input-auth"
                placeholder="Nama Lengkap Anda"
                value={namaPelaku}
                onChange={(e) => setNamaPelaku(e.target.value)}
              />
            </div>
            <div>
              <input
                id="nama-perusahaan-umkm-reg"
                name="nama-perusahaan-umkm"
                type="text"
                required
                className="input-auth"
                placeholder="Nama Perusahaan/UMKM Anda"
                value={namaPerusahaanUmkm}
                onChange={(e) => setNamaPerusahaanUmkm(e.target.value)}
              />
            </div>
            <div>
              <input
                id="nomor-whatsapp-reg"
                name="nomor-whatsapp"
                type="text"
                required
                className="input-auth"
                placeholder="Nomor WhatsApp (cth: 6281234567890)"
                value={nomorWhatsapp}
                onChange={(e) => setNomorWhatsapp(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Mendaftar...' : 'Daftar Sekarang'} {/* Changed button text */}
            </button>
            <div className="text-center text-sm mt-4"> {/* Increased mt to 4 */}
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#129990] hover:underline font-bold" // Changed font-medium to font-bold
              >
                Login di sini
              </button>
            </div>
          </>
        );
      case 'forgot-password':
        return (
          <>
            <div>
              <input
                id="email-forgot"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-auth"
                placeholder="Masukkan Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Mengirim...' : 'Kirim Link Reset Kata Sandi'} {/* Changed button text */}
            </button>
            <div className="text-center text-sm mt-4"> {/* Increased mt to 4 */}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#129990] hover:underline font-bold" // Changed font-medium to font-bold
              >
                Kembali ke Login
              </button>
            </div>
          </>
        );
      case 'resend-verification':
        return (
          <>
            <div>
              <input
                id="email-resend"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="input-auth"
                placeholder="Masukkan Email Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="btn-auth"
              disabled={loading}
            >
              {loading ? 'Mengirim Ulang...' : 'Kirim Ulang Email Verifikasi'} {/* Changed button text */}
            </button>
            <div className="text-center text-sm mt-4"> {/* Increased mt to 4 */}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#129990] hover:underline font-bold" // Changed font-medium to font-bold
              >
                Kembali ke Login
              </button>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (mode) {
      case 'login': return 'Selamat Datang Kembali!'; // More welcoming title
      case 'register': return 'Mulai Perjalanan UMKM Anda'; // More engaging title
      case 'forgot-password': return 'Atur Ulang Kata Sandi Anda'; // More action-oriented title
      case 'resend-verification': return 'Kirim Ulang Email Verifikasi';
      default: return '';
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f2f5] to-[#ffffff] py-12 px-4 sm:px-6 lg:px-8"> {/* Adjusted gradient for softer look */}
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 sm:p-10 space-y-8 border border-gray-100"> {/* Softer shadow, slightly larger padding, border */}
          <div className="flex flex-col items-center">
            <Image src={assets.logo} alt="Logo" width={72} height={72} className="mb-4" /> {/* Larger logo, increased mb */}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2 text-center">{getTitle()}</h2> {/* Font-extrabold, text-center */}
            <p className="text-gray-600 text-base text-center"> {/* Slightly darker text, base font size */}
              {mode === "login"
                ? "Masuk ke akun Anda untuk melanjutkan." // More concise
                : mode === "register"
                ? "Daftarkan UMKM Anda dan jangkau pasar lebih luas." // More benefit-oriented
                : mode === "forgot-password"
                ? "Kami akan mengirimkan instruksi ke email Anda." // Clearer instruction
                : mode === "resend-verification"
                ? "Masukkan email Anda untuk menerima email verifikasi baru." // Clearer instruction
                : ""}
            </p>
          </div>
          <form className="space-y-6" onSubmit={handleAuthSubmit}> {/* Increased space-y to 6 */}
            {renderFormContent()}
          </form>
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        .input-auth {
          @apply w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-[#129990] focus:ring-2 focus:ring-[#129990]/20 outline-none transition duration-200 ease-in-out text-gray-800 placeholder-gray-500; /* Rounded-xl, stronger focus ring, smoother transition, darker text, darker placeholder */
        }
        .btn-auth {
          @apply w-full py-3 rounded-xl bg-[#129990] text-white font-bold hover:bg-[#0e7c7a] transition duration-200 ease-in-out shadow-md hover:shadow-lg; /* Rounded-xl, font-bold, smoother transition, stronger shadow */
        }
      `}</style>
    </>
  );
};

export default LoginPage;