import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "./navbar";
import Footer from "./footer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Gena Courtney",
  description: "Southern Art",
  openGraph: {
    title: "Gena Courtney",
    description: "Southern Art",
    url: "https://genacourtney.com",
    siteName: "Next.js",
    images: [
      {
        secureUrl: "https://genacourtney.com/images/INSERT_IMAGE",
        url: "https://nextjs.org/og.png",
        width: 800,
        height: 600,
      },
      {
        secureUrl: "https://genacourtney.com/images/INSERT_IMAGE",
        url: "https://nextjs.org/og-alt.png",
        width: 1800,
        height: 1600,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gena Courtney",
    description: "Southern Art",
    creator: "Donovan Courtney",
    images: ["https://genacourtney.com/images/INSERT_IMAGE"],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  minimumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navbar />
          <main className="">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
