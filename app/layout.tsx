import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import MobileBottomNav from "@/components/MobileBottomNav";
import Footer from "@/components/Footer";
import ClientLayout from "@/components/ClientLayout";
import { NavigationSection } from "@/types";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const navigationSections: NavigationSection[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'services', label: 'Services', href: '#services' },
  { id: 'process', label: 'Process', href: '#process' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const metadata: Metadata = {
  title: "SB Infra Projects | Premium Construction Services",
  description: "Building excellence through innovation and quality craftsmanship. Expert construction services for residential, commercial, and industrial projects.",
  keywords: ["construction", "building", "architecture", "SB Infra", "infrastructure"],
  authors: [{ name: "SB Infra Projects" }],
  icons: {
    icon: [
      { url: '/logo.png', sizes: 'any' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: '/logo.png',
  },
  openGraph: {
    title: "SB Infra Projects | Premium Construction Services",
    description: "Building excellence through innovation and quality craftsmanship.",
    type: "website",
    images: ['/logo.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientLayout>
          <Navigation sections={navigationSections} />
          <MobileBottomNav sections={navigationSections} />
          <main>{children}</main>
          <Footer />
        </ClientLayout>
      </body>
    </html>
  );
}
