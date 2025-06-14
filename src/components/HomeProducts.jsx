"use client"
import React from "react";
import ProductCard from "./ProductCard";
import { useAppContext } from "@/context/AppContext";
import Link from "next/link";

const HomeProducts = () => {
  const { products } = useAppContext();

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Produk Populer</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {/* Tampilkan hingga 8 produk teratas atau sesuaikan jumlah yang diinginkan */}
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Link href="/products" className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        Lihat Semua Produk
      </Link>
    </div>
  );
};

export default HomeProducts;
