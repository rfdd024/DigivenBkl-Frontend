"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

type FeedbackType = {
  id: string;
  product_id: string;
  nama_produk: string;
  nama_pembeli: string;
  rating: number;
  komentar: string;
  created_at: string;
};

const FeedbackPage = () => {
  const { isAuthenticated, userProfile, jwtToken, backendApiUrl, initialized } = useAppContext();
  const [feedback, setFeedback] = useState<FeedbackType[]>([]);
  const [loading, setLoading] = useState(true);

  // Ambil feedback dari backend
  const fetchFeedback = async () => {
    if (!userProfile?.username) return;
    setLoading(true);
    try {
      const response = await fetch(
        `${backendApiUrl}/umkm/feedback/${userProfile.username}`,
        {
          headers: { Authorization: `Bearer ${jwtToken}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setFeedback(data.feedback || []);
      } else {
        toast.error(data.error || "Gagal mengambil feedback.");
      }
    } catch {
      toast.error("Gagal mengambil feedback.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialized && isAuthenticated && userProfile?.username) {
      fetchFeedback();
    }
    // eslint-disable-next-line
  }, [initialized, isAuthenticated, userProfile?.username]);

  if (!initialized) return <><Navbar /><Loading /><Footer /></>;
  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">
            Ulasan Produk
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Lihat semua feedback dan rating dari pembeli untuk produk-produk Anda.
          </p>

          {loading ? (
            <Loading />
          ) : feedback.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">
              Belum ada ulasan untuk produk Anda.
            </p>
          ) : (
            <div className="space-y-4">
              {feedback.map((fb) => (
                <div
                  key={fb.id}
                  className="bg-gray-50 p-4 rounded-lg shadow flex flex-col sm:flex-row gap-4"
                >
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                      <span className="font-semibold text-[#129990]">{fb.nama_pembeli}</span>
                      <span className="text-xs text-gray-400">
                        {new Date(fb.created_at).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="mb-1">
                      <span className="font-medium text-gray-800">Produk: </span>
                      <span className="text-gray-700">{fb.nama_produk}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <span key={idx}>
                          {idx < fb.rating ? "⭐" : "☆"}
                        </span>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">{fb.rating}/5</span>
                    </div>
                    <div className="text-gray-700">{fb.komentar}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FeedbackPage;