"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

// Definisi tipe data untuk profil UMKM
interface UmkmProfile {
  id: string;
  nama_perusahaan_umkm: string;
  username: string;
  is_verified?: boolean; // Tambahkan is_verified jika ada di respons login
  nama_pelaku?: string;
  nomor_whatsapp?: string;
  lokasi_perusahaan_umkm?: string;
  jam_operasional?: string;
  foto_profil_umkm?: string;
  foto_banner_umkm?: string[];
}

// Definisi tipe data untuk Produk
interface ProductType {
  id: string;
  nama_produk: string;
  deskripsi_produk: string;
  harga_produk: number;
  gambar_url: string[];
  created_at: string;
  average_rating?: number;
  umkm_id?: string;
}

// Definisi bentuk AppContext
interface AppContextType {
  isAuthenticated: boolean;
  isSeller: boolean;
  jwtToken: string | null;
  userProfile: UmkmProfile | null;
  backendApiUrl: string;
  currency: string;
  login: (token: string, profile: UmkmProfile) => void;
  logout: () => void;
  setUserProfile: (profile: UmkmProfile | null) => void; // Setter untuk update profil
  products: ProductType[]; // Semua produk publik
  umkms: UmkmProfile[]; // Semua daftar UMKM publik
  fetchProducts: () => Promise<void>; // Fungsi untuk mengambil ulang produk publik
  fetchUmkms: () => Promise<void>; // Fungsi untuk mengambil ulang daftar UMKM publik
  initialized: boolean;
}

// Buat Context dengan nilai default
const AppContext = createContext<AppContextType | undefined>(undefined);

// Definisi komponen AppProvider
export const AppContextProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  const [jwtToken, setJwtToken] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<UmkmProfile | null>(null);
  const [products, setProducts] = useState<ProductType[]>([]);
  const [umkms, setUmkms] = useState<UmkmProfile[]>([]);
  const [initialized, setInitialized] = useState(false);

  const backendApiUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'https://digiven-bengkulu-backend.vercel.app/';
  const currency = process.env.NEXT_PUBLIC_CURRENCY || 'Rp';

  // Fungsi logout menggunakan useCallback untuk stabilitas
  const logout = useCallback(() => {
    setJwtToken(null);
    setUserProfile(null);
    setIsAuthenticated(false);
    setIsSeller(false);
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('userProfile');
    toast.success('Anda telah logout.');
    router.push('/login'); // Redirect ke halaman login setelah logout
  }, [router]);

  // Muat status dari localStorage saat pemuatan awal
  useEffect(() => {
    const storedToken = localStorage.getItem('jwtToken');
    const storedUserProfile = localStorage.getItem('userProfile');

    if (storedToken && storedUserProfile) {
      try {
        const profile = JSON.parse(storedUserProfile);
        setJwtToken(storedToken);
        setUserProfile(profile);
        setIsAuthenticated(true);
        setIsSeller(!!profile.username); // Asumsi keberadaan 'username' menunjukkan seller
      } catch (e) {
        console.error("Gagal mengurai profil pengguna yang tersimpan:", e);
        // Hapus data yang tidak valid
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('userProfile');
        logout(); // Logout jika data rusak
      }
    }
    setInitialized(true); // <-- Tambahkan ini
  }, [logout]);

  // Ambil produk publik untuk halaman Produk
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${backendApiUrl}/api/v1/public/products`);
      if (!response.ok) {
        throw new Error('Gagal mengambil produk');
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error saat mengambil semua produk:', error);
      toast.error('Gagal memuat daftar produk.');
      setProducts([]);
    }
  }, [backendApiUrl]);

  // Ambil daftar UMKM publik untuk halaman UMKM Publik dan Produk Unggulan
  const fetchUmkms = useCallback(async () => {
    try {
      const response = await fetch(`${backendApiUrl}/public/umkms`);
      if (!response.ok) {
        throw new Error('Gagal mengambil daftar UMKM');
      }
      const data = await response.json();
      setUmkms(data.umkms || []);
    } catch (error) {
      console.error('Error saat mengambil semua UMKM:', error);
      toast.error('Gagal memuat daftar UMKM.');
      setUmkms([]);
    }
  }, [backendApiUrl]);

  // Pengambilan data awal untuk daftar publik
  useEffect(() => {
    fetchProducts();
    fetchUmkms();
  }, [fetchProducts, fetchUmkms]);


  // Fungsi login
  const login = (newToken: string, profile: UmkmProfile) => {
    setJwtToken(newToken);
    setUserProfile(profile);
    setIsAuthenticated(true);
    setIsSeller(!!profile.username);
    localStorage.setItem('jwtToken', newToken);
    localStorage.setItem('userProfile', JSON.stringify(profile));
    toast.success('Login berhasil!');
    // Tidak ada router.push di sini, biarkan komponen pemanggil menanganinya
  };

  // Nilai context yang akan disediakan
  const contextValue: AppContextType = {
    isAuthenticated,
    isSeller,
    jwtToken,
    userProfile,
    backendApiUrl,
    currency,
    login,
    logout,
    setUserProfile, // Sediakan setter untuk update profil
    products,
    umkms,
    fetchProducts,
    fetchUmkms,
    initialized,
  };

  return (
    <AppContext.Provider value={contextValue}>
      {children}
    </AppContext.Provider>
  );
};

// Hook kustom untuk menggunakan AppContext
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext harus digunakan dalam AppProvider');
  }
  return context;
};
