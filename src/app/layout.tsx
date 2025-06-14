import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";

const outfit = Outfit({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "UMKM - DIGIVEN",
  description: "Aplikasi untuk membantu UMKM dalam mengelola bisnis mereka dengan lebih efisien.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${outfit.className} antialiased text-gray-700`}>
        <Toaster position="top-right" />
        <AppContextProvider>
          {children}
        </AppContextProvider>
      </body>
    </html>
  );
}
