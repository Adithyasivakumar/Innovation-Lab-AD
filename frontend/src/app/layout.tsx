import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KiTE AI & DS Innovation Lab Management Portal",
  description: "Enterprise management portal for Artificial Intelligence and Data Science at KGiSL Institute of Technology (KiTE). Role-based access for Admin, Faculty, and Students.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-[#090d16] text-slate-100 selection:bg-cyan-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
