'use client';

import React from "react";
import ProductCard from "@/components/ProductCard";
import { useAppContext } from "@/context/AppContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Loading from "@/components/Loading";

const AllProductsPage = () => {
  const { products } = useAppContext();
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (products.length > 0) {
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [products.length]);

  return (
    <>
      <Navbar />
      <div className="px-6 md:px-16 lg:px-32 py-8">
        <h1 className="text-3xl font-semibold text-center mb-8">Semua Produk UMKM</h1>
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <p className="text-center text-gray-500">Tidak ada produk yang ditemukan saat ini.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AllProductsPage;