import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Image className="w-28 md:w-32" src={assets.logo} alt="logo" />
          <p className="mt-6 text-sm">
            Temukan produk UMKM terbaik dari Bengkulu. Dukung bisnis lokal dan nikmati kualitas produk unggulan.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Perusahaan</h2>
            <ul className="text-sm space-y-2">
              <li>
                <a className="hover:underline transition" href="/">Beranda</a>
              </li>
              <li>
                <a className="hover:underline transition" href="/about-us">Tentang Kami</a> {/* Tambahkan halaman ini nanti jika perlu */}
              </li>
              <li>
                <a className="hover:underline transition" href="/contact-us">Hubungi Kami</a> {/* Tambahkan halaman ini nanti jika perlu */}
              </li>
              <li>
                <a className="hover:underline transition" href="/privacy-policy">Kebijakan Privasi</a> {/* Tambahkan halaman ini nanti jika perlu */}
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Kontak Kami</h2>
            <div className="text-sm space-y-2">
              <p>+62-812-3456-7890</p> {/* Contoh nomor Indonesia */}
              <p>contact@umkmbengkulu.dev</p> {/* Contoh email */}
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2025 © UMKM Bengkulu. All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
