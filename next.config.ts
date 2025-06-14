import type { NextConfig } from "next";

const nextConfig: NextConfig = {
      images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'placehold.co', // Untuk gambar placeholder
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'img.clerk.com', // Jika Anda menggunakan Clerk untuk autentikasi/gambar user
                pathname: '**',
            },
            // Tambahkan domain lain jika diperlukan
        ],
    },
};

export default nextConfig;
