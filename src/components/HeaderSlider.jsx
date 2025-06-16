"use client";
import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";

const HeaderSlider = () => {
  const sliderData = [
    {
      id: 1,
      title: "Jelajahi Produk Terbaik dari UMKM Lokal Bengkulu!",
      offer: "Penawaran Terbatas Diskon 30%",
      buttonText1: "Beli Sekarang",
      buttonText2: "Cari Lebih Banyak",
      imgSrc: assets.food1,
    },
    {
      id: 2,
      title: "Dukung Ekonomi Lokal - Temukan UMKM Favorit Anda Hari Ini!",
      offer: "Segera! Produk Terbaru!",
      buttonText1: "Lihat Toko",
      buttonText2: "Jelajahi Promo",
      imgSrc: assets.drink,
    },
    {
      id: 3,
      title: "Kualitas Terjamin, Harga Terjangkau - Belanja Langsung dari Produsen!",
      offer: "Diskon Eksklusif 40%",
      buttonText1: "Pesan Sekarang",
      buttonText2: "Pelajari Lebih Lanjut",
      imgSrc: assets.food2,
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#FFFBDE] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            {/* Text Content */}
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-[#096B68] pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6">
                <Link href="/products">
                  <button className="md:px-10 px-7 md:py-2.5 py-2 bg-[#129990] rounded-full text-white font-medium hover:cursor-pointer">
                    {slide.buttonText1}
                  </button>
                </Link>
                <Link href="/public-umkms">
                  <button className="group flex items-center gap-2 px-6 py-2.5 font-medium hover:cursor-pointer">
                    {slide.buttonText2}
                    <Image
                      className="group-hover:translate-x-1 transition"
                      src={assets.arrow_icon}
                      alt="arrow_icon"
                    />
                  </button>
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="flex items-center flex-1 justify-center">
              <Image
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
                unoptimized
              />
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bullets */}
      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-[#129990]" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
