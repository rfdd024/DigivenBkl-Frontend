"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppContext } from '@/context/AppContext'; // Perbaikan impor
import Navbar from '@/components/Navbar'; // Perbaikan impor
import Footer from '@/components/Footer'; // Perbaikan impor
import Image from 'next/image';
import { assets } from '@/assets/assets'; // Perbaikan impor
import Loading from '@/components/Loading'; // Impor komponen Loading
import Link from 'next/link'; // Import Link for UMKM store navigation
import toast from 'react-hot-toast';

type FeedbackType = {
  id: string;
  rating: number;
  nama_pembeli: string;
  komentar: string;
  created_at: string;
};

// Definisi tipe data untuk Product Detail
interface ProductDetailType {
  id: string;
  nama_produk: string;
  deskripsi_produk: string;
  harga_produk: number;
  gambar_url: string[];
  created_at: string;
  umkm: {
    id: string;
    nama_perusahaan_umkm: string;
    username: string;
    nama_pelaku: string;
    foto_profil_umkm?: string;
    foto_banner_umkm?: string[];
    lokasi_perusahaan_umkm?: string;
    jam_operasional?: string;
    nomor_whatsapp?: string; // Perbaikan: Tambahkan properti nomor_whatsapp
  };
  average_rating: number;
  feedback: FeedbackType[];
}

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { backendApiUrl, currency } = useAppContext();
  const [productDetail, setProductDetail] = useState<ProductDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const [namaPembeli, setNamaPembeli] = useState('');
  const [rating, setRating] = useState(5);
  const [komentar, setKomentar] = useState('');
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [showFeedbackForm, setShowFeedbackForm] = useState(false); // State untuk mengontrol tampilan formulir ulasan
  const [recentFeedbackId, setRecentFeedbackId] = useState<string | null>(null);
  const [recentFeedbackTimeout, setRecentFeedbackTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (productId) {
      const fetchProductDetail = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(`${backendApiUrl}/public/products/${productId}`);
          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Gagal mengambil detail produk.');
          }
          const data = await response.json();
          setProductDetail(data.product);
          setCurrentImage(0); // Reset gambar utama saat produk baru dimuat
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
      fetchProductDetail();
    }
  }, [productId, backendApiUrl]);

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaPembeli || !komentar || !rating) {
      toast.error('Semua field wajib diisi.');
      return;
    }
    setLoadingFeedback(true);
    try {
      const response = await fetch(
        `${backendApiUrl}/public/feedback/${productId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            nama_pembeli: namaPembeli, 
            rating: Number(rating),
            komentar 
          }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || 'Feedback berhasil dikirim!');
        setNamaPembeli('');
        setRating(5);
        setKomentar('');
        // Simpan ID feedback baru
        setRecentFeedbackId(data.feedback?.id || null);
        // Set timeout untuk menghilangkan icon delete setelah 2 menit
        if (recentFeedbackTimeout) clearTimeout(recentFeedbackTimeout);
        const timeout = setTimeout(() => setRecentFeedbackId(null), 2 * 60 * 1000);
        setRecentFeedbackTimeout(timeout);
        // Tambahkan feedback ke list
        setProductDetail((prev) =>
          prev
            ? {
                ...prev,
                feedback: [
                  {
                    id: data.feedback?.id || Math.random().toString(),
                    nama_pembeli: namaPembeli,
                    rating,
                    komentar,
                    created_at: new Date().toISOString(),
                  },
                  ...prev.feedback,
                ],
              }
            : prev
        );
      } else {
        toast.error(data.error || 'Gagal mengirim feedback.');
      }
    } catch {
      toast.error('Gagal mengirim feedback.');
    } finally {
      setLoadingFeedback(false);
    }
  };

  const handleDeleteFeedback = async (feedbackId: string) => {
    if (!confirm("Yakin ingin menghapus ulasan ini?")) return;
    try {
      const response = await fetch(
        `${backendApiUrl}/public/feedback/${feedbackId}`,
        { method: "DELETE" }
      );
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Ulasan berhasil dihapus!");
        setProductDetail((prev) =>
          prev
            ? {
                ...prev,
                feedback: prev.feedback.filter((f) => f.id !== feedbackId),
              }
            : prev
        );
        setRecentFeedbackId(null);
      } else {
        toast.error(data.error || "Gagal menghapus ulasan.");
      }
    } catch {
      toast.error("Gagal menghapus ulasan.");
    }
  };

  useEffect(() => {
    return () => {
      if (recentFeedbackTimeout) clearTimeout(recentFeedbackTimeout);
    };
  }, [recentFeedbackTimeout]);

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

  if (!productDetail) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg text-gray-600">Produk tidak ditemukan.</p>
        </div>
        <Footer />
      </>
    );
  }

  const {
    nama_produk,
    deskripsi_produk,
    harga_produk,
    gambar_url,
    umkm,
    average_rating,
    feedback
  } = productDetail;

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8 flex flex-col md:flex-row gap-8">
        {/* Kolom Kiri: Gambar Produk */}
        <div className="md:w-1/2 flex flex-col items-center">
          <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mb-4">
            {gambar_url && gambar_url.length > 0 ? (
              <Image
                src={gambar_url[currentImage]}
                alt={nama_produk || 'Produk'}
                width={800}
                height={800}
                className="object-contain w-full h-full"
                unoptimized
                onError={(e) => {
                    e.currentTarget.src = assets.placeholder_image;
                }}
              />
            ) : (
              <p className="text-gray-500">Tidak ada gambar</p>
            )}
          </div>
          {gambar_url && gambar_url.length > 1 && (
            <div className="flex gap-2 mt-2">
              {gambar_url.map((imgUrl: string, index: number) => (
                <Image
                  key={`${imgUrl}-${index}`} // Sudah benar
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  width={80}
                  height={80}
                  className={`cursor-pointer rounded-md border-2 ${currentImage === index ? 'border-[#129990]' : 'border-transparent'} object-cover`}
                  onClick={() => setCurrentImage(index)}
                  unoptimized
                  onError={(e) => {
                      e.currentTarget.src = assets.placeholder_image;
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Kolom Kanan: Detail Produk */}
        <div className="md:w-1/2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">{nama_produk}</h1>
          <p className="text-2xl font-semibold text-[#129990] mb-4">{currency}{harga_produk.toLocaleString('id-ID')}</p>
          <p className="text-gray-700 leading-relaxed mb-6">{deskripsi_produk}</p>

          <div className="flex items-center gap-2 mb-4">
            <p className="text-base font-medium">Rating:</p>
            <p className="text-base">{average_rating ? average_rating.toFixed(1) : 0}</p>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <Image
                  key={index} // Masih aman menggunakan index di sini karena array statis dan tidak berubah urutan
                  className="h-4 w-4"
                  src={
                    index < Math.floor(average_rating || 0)
                      ? assets.star_icon
                      : assets.star_dull_icon
                  }
                  alt="star_icon"
                />
              ))}
            </div>
            <span className="text-sm text-gray-500">({feedback.length} ulasan)</span>
          </div>

          <button className="px-8 py-3 bg-[#129990] text-white rounded-full text-lg font-medium hover:bg-opacity-90 transition mb-8">
            Beli Sekarang
          </button>

          {/* Informasi UMKM */}
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">Informasi Toko UMKM</h2>
            <div className="flex items-center mb-3">
              {umkm.foto_profil_umkm && (
                <Image
                    src={umkm.foto_profil_umkm}
                    alt={umkm.nama_perusahaan_umkm || 'Foto Profil UMKM'}
                    width={64}
                    height={64}
                    className="w-16 h-16 rounded-full object-cover mr-4 border border-gray-200"
                    unoptimized
                />
              )}
              <div>
                {/* Perbaikan: Pastikan umkm.username ada sebelum membuat tautan */}
                {umkm.username ? (
                    <Link href={`/umkms/${umkm.username}`} className="text-blue-600 hover:underline text-lg font-medium">
                        {umkm.nama_perusahaan_umkm}
                    </Link>
                ) : (
                    <p className="text-lg font-medium text-gray-800">
                        {umkm.nama_perusahaan_umkm}
                    </p>
                )}
                <p className="text-sm text-gray-600">Oleh: {umkm.nama_pelaku}</p>
              </div>
            </div>
            {umkm.lokasi_perusahaan_umkm && (
              <p className="text-gray-700 mb-2">
                <span className="font-medium">Lokasi:</span> <a href={umkm.lokasi_perusahaan_umkm} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Lihat di Peta</a>
              </p>
            )}
            {umkm.jam_operasional && (
              <p className="text-gray-700">
                <span className="font-medium">Jam Operasional:</span> {umkm.jam_operasional}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-2xl font-semibold text-gray-800 m-0 p-0">
              Ulasan Produk ({feedback.length})
            </h2>
            <button
              className="px-6 py-2 bg-[#129990] text-white rounded-full font-semibold hover:bg-opacity-90 transition whitespace-nowrap"
              onClick={() => setShowFeedbackForm((prev) => !prev)}
            >
              {showFeedbackForm ? "Tutup Form Ulasan" : "Buat Ulasan"}
            </button>
          </div>
          {feedback.length === 0 ? (
            <p className="text-gray-600">Belum ada ulasan untuk produk ini. Jadilah yang pertama memberikan ulasan!</p>
          ) : (
            <div className="space-y-4">
              {feedback.map((f: FeedbackType) => (
                <div key={`${f.id}-${f.nama_pembeli}`} className="bg-gray-50 p-4 rounded-lg shadow-sm flex justify-between items-start group">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <p className="font-medium">{f.nama_pembeli}</p>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Image
                            key={index}
                            className="h-3 w-3"
                            src={index < Math.floor(f.rating) ? assets.star_icon : assets.star_dull_icon}
                            alt="star_icon"
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(f.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <p className="text-gray-700">{f.komentar}</p>
                  </div>
                  {/* Icon Delete hanya muncul jika feedback ini adalah yang baru dibuat */}
                  {f.id === recentFeedbackId && (
                    <button
                      onClick={() => handleDeleteFeedback(f.id)}
                      className="opacity-60 hover:opacity-100 ml-4 mt-1 group-hover:opacity-100 transition"
                      title="Hapus ulasan"
                    >
                      <Image
                        src={assets.error_icon}
                        alt="Delete"
                        width={20}
                        height={20}
                        unoptimized
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
          {showFeedbackForm && (
            <div className="mt-4 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Tulis Ulasan Anda</h2>
              <form onSubmit={handleFeedbackSubmit} className="bg-gray-50 p-4 rounded-lg shadow-sm space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nama Anda</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border rounded"
                    value={namaPembeli}
                    onChange={(e) => setNamaPembeli(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rating</label>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <button
                        type="button"
                        key={idx}
                        className={`text-2xl ${rating > idx ? 'text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setRating(idx + 1)}
                        aria-label={`Beri rating ${idx + 1}`}
                      >
                        ★
                      </button>
                    ))}
                    <span className="ml-2 text-sm text-gray-500">{rating}/5</span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Komentar</label>
                  <textarea
                    className="w-full px-4 py-2 border rounded"
                    value={komentar}
                    onChange={(e) => setKomentar(e.target.value)}
                    required
                    rows={3}
                    placeholder="Tulis ulasan Anda di sini..."
                  />
                </div>
                <button
                  type="submit"
                  className="px-8 py-2 bg-[#129990] text-white rounded-full font-semibold hover:bg-opacity-90 transition"
                  disabled={loadingFeedback}
                >
                  {loadingFeedback ? 'Mengirim...' : 'Kirim Ulasan'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductDetailPage;
