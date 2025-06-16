"use client";
import React from "react";
import Image from "next/image";
import { assets } from "@/assets/assets";
import { useRouter } from "next/navigation";

const Footer = () => {
  const router = useRouter();
  const handleNavigate = () => router.push("/products");

  const brandLogos = [
    "/html.svg",
    "/tailwind.svg",
    "/next.svg",
    "/python.svg",
    "/node.svg",
  ];

  return (
    <footer className="bg-[#096B68] text-[#FFFBDE] text-sm">
      {/* Brand Marquee */}
      <div className="bg-[#90D1CA] overflow-hidden py-4">
        <div className="marquee-track flex w-max items-center gap-32">
          {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((src, i) => (
            <div key={i} className="flex-shrink-0">
              <Image
                src={src}
                alt={`brand-${i}`}
                width={50}
                height={32}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Logo + Title */}
      <div className="flex flex-col items-center text-center py-12 px-4 border-b border-[#129990]">
        <Image
          src={assets.logo}
          alt="DigivenBengkulu Logo"
          width={128}
          height={128}
          className="w-20 md:w-28 lg:w-32 mb-8 bg-[#FFFBDE] border rounded-full"
        />
        <h2 className="text-lg md:text-xl font-medium leading-snug">
          Digital Venture Bengkulu
        </h2>
        <p className="mt-4">
          Temukan produk UMKM terbaik dari Bengkulu. Dukung bisnis lokal dan nikmati kualitas produk unggulan.
        </p>
      </div>

      {/* Navigation Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-6 md:px-16 lg:px-32 py-12 border-b border-[#129990] text-center">
        {/* Makanan */}
        <div onClick={handleNavigate} className="cursor-pointer">
          <h3 className="text-white font-semibold mb-4">Makanan</h3>
          <ul className="space-y-2">
            {["Nasi Goreng", "Sate Ayam", "Rendang", "Bakso", "Gudeg"].map((item) => (
              <li key={item} className="hover:text-[#FFFBDE]/70">{item}</li>
            ))}
          </ul>
        </div>

        {/* Minuman */}
        <div onClick={handleNavigate} className="cursor-pointer">
          <h3 className="text-white font-semibold mb-4">Minuman</h3>
          <ul className="space-y-2">
            {["Es Teh", "Kopi Tubruk", "Wedang Jahe", "Susu Murni", "Es Cincau"].map((item) => (
              <li key={item} className="hover:text-[#FFFBDE]/70">{item}</li>
            ))}
          </ul>
        </div>

        {/* Cemilan */}
        <div onClick={handleNavigate} className="cursor-pointer">
          <h3 className="text-white font-semibold mb-4">Cemilan</h3>
          <ul className="space-y-2">
            {["Keripik Singkong", "Pisang Goreng", "Lemper", "Bakwan", "Risoles"].map((item) => (
              <li key={item} className="hover:text-[#FFFBDE]/70">{item}</li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Kontak Kami</h3>
          <ul className="space-y-2">
            <li>Email: info@digivenbkl.com</li>
            <li>Phone: +62 812-3456-7890</li>

            <li>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 hover:underline"
              >
                Instagram
                <Image
                  src={assets.ig_ic}
                  alt="instagram"
                  width={16}
                  height={16}
                />
              </a>
            </li>

            <li>
              <a
                href="https://facebook.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 hover:underline"
              >
                Facebook
                <Image
                  src={assets.fb_ic}
                  alt="facebook"
                  width={16}
                  height={16}
                />
              </a>
            </li>

            <li>
              <a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex justify-center items-center gap-2 hover:underline"
              >
                Twitter
                <Image
                  src={assets.twit_ic}
                  alt="twitter"
                  width={16}
                  height={16}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center py-4 text-xs text-[#FFFBDE]/70">
        Copyright &copy; 2025 DigivenBengkulu &#124; All Rights Reserved
      </div>

      {/* Marquee Animation */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 50s linear infinite;
        }

        @keyframes marquee {
          0% {
            transform: translateX(100%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
