"use client";
import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";
import Link from "next/link";
import { useRouter } from "next/navigation";

const HomeProducts = () => {
  const { products } = useAppContext();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center pt-14 px-4 md:px-0">
      {/* Header Atas: Deskripsi + Tombol */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full max-w-7xl">
        <div className="flex flex-col items-start w-full md:w-auto">
          <p className="text-2xl font-medium w-full text-center md:text-left">Produk Terpopuler</p>
          <p className="text-sm text-gray-500 max-w-md mt-1 text-center md:text-left">
            Temukan produk pilihan terbaik dari pelaku UMKM unggulan yang paling diminati pengguna. Kami menampilkan produk terpopuler berdasarkan penilaian, ulasan, dan penjualan tertinggi.
          </p>
        </div>
        <button
          onClick={() => router.push("/products")}
          className="flex items-center self-center md:self-auto px-4 py-1.5 text-sm bg-black text-white rounded-full hover:bg-gray-800 transition"
        >
          Lihat Semua
          <span className="pl-1">
            <Image
              src={assets.arrow_icon_white}
              alt="arrow-icon"
              width={16}
              height={16}
            />
          </span>
        </button>
      </div>

      {/* Grid Produk */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8 pb-14 w-full max-w-7xl">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default HomeProducts;
