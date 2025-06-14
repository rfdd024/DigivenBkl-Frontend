"use client";

import React, { useEffect, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";
import Image from "next/image";
import { assets } from "@/assets/assets";

type ProductType = {
  id: string;
  nama_produk: string;
  deskripsi_produk: string;
  harga_produk: number;
  gambar_url: string[];
  created_at: string;
};

const DashboardProductsPage = () => {
  const { isAuthenticated, jwtToken, backendApiUrl, initialized } = useAppContext();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState<ProductType | null>(null);

  // Form state
  const [namaProduk, setNamaProduk] = useState("");
  const [deskripsiProduk, setDeskripsiProduk] = useState("");
  const [hargaProduk, setHargaProduk] = useState("");
  const [gambarUrl, setGambarUrl] = useState<string>("");

  // Fetch produk milik UMKM login
  const fetchProducts = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${backendApiUrl}/umkm/products`, {
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        toast.error(data.error || "Gagal mengambil produk.");
      }
    } catch {
      toast.error("Gagal mengambil produk.");
    } finally {
      setLoading(false);
    }
  }, [backendApiUrl, jwtToken]);

  useEffect(() => {
    if (initialized && isAuthenticated && jwtToken) {
      fetchProducts();
    }
  }, [initialized, isAuthenticated, jwtToken, fetchProducts]);

  // Reset form
  const resetForm = () => {
    setNamaProduk("");
    setDeskripsiProduk("");
    setHargaProduk("");
    setGambarUrl("");
    setEditProduct(null);
  };

  // Handle tambah/edit produk
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!namaProduk || !deskripsiProduk || !hargaProduk || !gambarUrl) {
      toast.error("Semua field wajib diisi.");
      return;
    }
    const body = {
      nama_produk: namaProduk,
      deskripsi_produk: deskripsiProduk,
      harga_produk: Number(hargaProduk),
      gambar_url: gambarUrl.split(",").map((url) => url.trim()).filter(Boolean),
    };
    try {
      let url = `${backendApiUrl}/umkm/products`;
      let method: "POST" | "PUT" = "POST";
      if (editProduct) {
        url = `${backendApiUrl}/umkm/products/${editProduct.id}`;
        method = "PUT";
      }
      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || (editProduct ? "Produk diperbarui!" : "Produk ditambahkan!"));
        setShowForm(false);
        resetForm();
        fetchProducts();
      } else {
        toast.error(data.error || "Gagal menyimpan produk.");
      }
    } catch {
      toast.error("Gagal menyimpan produk.");
    }
  };

  // Handle hapus produk
  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;
    try {
      const response = await fetch(`${backendApiUrl}/umkm/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Produk dihapus!");
        fetchProducts();
      } else {
        toast.error(data.error || "Gagal menghapus produk.");
      }
    } catch {
      toast.error("Gagal menghapus produk.");
    }
  };

  // Saat context belum siap atau belum login
  if (!initialized) return <><Navbar /><Loading /><Footer /></>;
  if (!isAuthenticated) return null;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-100 py-8 px-4 md:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-xl">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Manajemen Produk</h1>
            <button
              className="px-6 py-2 bg-[#129990] text-white rounded-lg font-semibold hover:bg-opacity-90 transition"
              onClick={() => {
                setShowForm(true);
                resetForm();
              }}
            >
              + Tambah Produk
            </button>
          </div>

          {/* Form Tambah/Edit Produk */}
          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8 space-y-4">
              <h2 className="text-xl font-semibold mb-2">{editProduct ? "Edit Produk" : "Tambah Produk"}</h2>
              <div>
                <label className="block text-sm font-medium mb-1">Nama Produk</label>
                <input
                  className="w-full px-4 py-2 border rounded"
                  value={namaProduk}
                  onChange={(e) => setNamaProduk(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi Produk</label>
                <textarea
                  className="w-full px-4 py-2 border rounded"
                  value={deskripsiProduk}
                  onChange={(e) => setDeskripsiProduk(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Harga Produk</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border rounded"
                  value={hargaProduk}
                  onChange={(e) => setHargaProduk(e.target.value)}
                  required
                  min={0}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">URL Gambar Produk (pisahkan dengan koma untuk lebih dari 1)</label>
                <input
                  className="w-full px-4 py-2 border rounded"
                  value={gambarUrl}
                  onChange={(e) => setGambarUrl(e.target.value)}
                  required
                  placeholder="https://img1.jpg, https://img2.jpg"
                />
                {/* Preview gambar */}
                <div className="flex gap-2 mt-2">
                  {gambarUrl.split(",").map((url, idx) =>
                    url.trim() ? (
                      <Image
                        key={idx}
                        src={url.trim()}
                        alt={`Gambar ${idx + 1}`}
                        width={60}
                        height={60}
                        className="rounded border"
                        unoptimized
                        onError={(e) => {
                          e.currentTarget.src = assets.placeholder_image;
                        }}
                      />
                    ) : null
                  )}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#129990] text-white rounded font-semibold hover:bg-opacity-90 transition"
                  disabled={loading}
                >
                  {editProduct ? "Simpan Perubahan" : "Tambah Produk"}
                </button>
                <button
                  type="button"
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded font-semibold hover:bg-gray-400 transition"
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* Daftar Produk */}
          {loading ? (
            <Loading />
          ) : products.length === 0 ? (
            <p className="text-center text-gray-500 mt-12">Belum ada produk. Tambahkan produk pertamamu!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
              {products.map((product) => (
                <div key={product.id} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row gap-4 items-center shadow">
                  <Image
                    src={product.gambar_url[0] || assets.placeholder_image}
                    alt={product.nama_produk}
                    width={100}
                    height={100}
                    className="rounded border object-cover w-full sm:w-24 h-24"
                    unoptimized
                  />
                  <div className="flex-1 w-full">
                    <h3 className="text-base sm:text-lg font-bold">{product.nama_produk}</h3>
                    <p className="text-gray-600 text-xs sm:text-sm mb-1">{product.deskripsi_produk}</p>
                    <p className="font-semibold text-[#129990] mb-2 text-sm sm:text-base">Rp{product.harga_produk.toLocaleString("id-ID")}</p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        onClick={() => {
                          setShowForm(true);
                          setEditProduct(product);
                          setNamaProduk(product.nama_produk);
                          setDeskripsiProduk(product.deskripsi_produk);
                          setHargaProduk(product.harga_produk.toString());
                          setGambarUrl((product.gambar_url || []).join(", "));
                        }}
                      >
                        Edit
                      </button>
                        <a
                            href={`/products/${product.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-1 bg-[#129990] text-white rounded hover:bg-opacity-90 text-sm transition"
                            >
                            Lihat
                        </a>
                      <button
                        className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                        onClick={() => handleDelete(product.id)}
                      >
                        Hapus
                      </button>
                    </div>
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

export default DashboardProductsPage;