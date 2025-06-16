"use client"
import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';

const ProductCard = ({ product }) => {
    const { currency } = useAppContext();
    const router = useRouter();

    const imageUrl =
        Array.isArray(product.gambar_url) && product.gambar_url.length > 0
            ? product.gambar_url[0]
            : assets.placeholder_image;

    const handleProductClick = () => {
        router.push(`/products/${product.id}`);
        window.scrollTo(0, 0);
    };

    return (
        <div
            onClick={handleProductClick}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer"
        >
            <div className="cursor-pointer group relative bg-gray-500/10 rounded-lg w-full h-52 flex items-center justify-center overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={product.nama_produk || 'Produk'}
                    className="group-hover:scale-105 transition object-cover w-4/5 h-4/5 md:w-full md:h-full"
                    width={800}
                    height={800}
                    onError={(e) => {
                        e.currentTarget.src = assets.placeholder_image;
                    }}
                    unoptimized
                />
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.nama_produk}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.deskripsi_produk}</p>
            <div className="flex items-center gap-2">
                {/* Average rating dari backend (jika ada) */}
                <p className="text-xs">{product.average_rating ? product.average_rating.toFixed(1) : 0}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(product.average_rating || 0)
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.harga_produk.toLocaleString('id-ID')}</p>
                <button className=" max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition">
                    Beli sekarang
                </button>
            </div>
        </div>
    )
}

export default ProductCard;
