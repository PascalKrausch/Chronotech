import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "./components/navbar";
import Footer from "./components/Footer";
import Providers from "./provider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChronoTech",
  description: "Plattform für Technikgeschichte",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-stone-800">
        <Providers>
          <Navbar />

          <main className="flex-1 bg-stone-800">{children}</main>

          <Footer />

          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
