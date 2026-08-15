import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteConfig } from "@/lib/site-config";
import ThemeScript from "@/components/ui/ThemeScript";
import Nav from "@/components/nav/Nav";
import ScrollProgress from "@/components/ui/ScrollProgress";
import StatusBar from "@/components/ui/StatusBar";
import Footer from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: siteConfig.title,
  description: siteConfig.description,
  icons: {
    icon: "/images/avatar.jpg",
    apple: "/images/avatar.jpg",
  },
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.ogDescription,
    url: siteConfig.url,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.ogDescription,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ScrollProgress />
        <Nav />
        <StatusBar />
        <div className="relative mx-auto max-w-[1010px] px-[clamp(20px,5vw,34px)]">
          {children}
          <Footer />
        </div>
      </body>
    </html>
  );
}
