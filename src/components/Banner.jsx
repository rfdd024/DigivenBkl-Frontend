import React from "react";
import Link from "next/link";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Banner = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#FFFBDE] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56"
        src={assets.food3}
        alt="Mi Ayam"
        unoptimized
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Tingkatkan Pengalaman Belanja UMKM Anda!
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          Dari produk kuliner lezat hingga kerajinan tangan unik—semua yang Anda butuhkan ada di sini.
        </p>
        <Link
          href="/public-umkms"
          className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-[#129990] rounded text-white hover:bg-[#0f867e] transition"
        >
          Belanja Sekarang
          <Image
            className="group-hover:translate-x-1 transition"
            src={assets.arrow_icon_white}
            alt="arrow_icon_white"
          />
        </Link>
      </div>
      <Image
        className="hidden md:block max-w-80"
        src={assets.drink2}
        alt="Kopi"
        unoptimized
      />
      <Image
        className="md:hidden"
        src={assets.food5}
        alt="Makanan Wajik"
        unoptimized
      />
    </div>
  );
};

export default Banner;
