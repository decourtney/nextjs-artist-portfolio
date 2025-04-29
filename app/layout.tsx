import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Charm, Open_Sans } from "next/font/google";
import { getServerSession } from "next-auth";
import { _nextAuthOptions } from "@/auth";
import { ReactNode } from "react";

const charm = Charm({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-charm",
  display: "swap",
  preload: true,
});

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-openSans",
  display: "swap",
  preload: true,
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
        secureUrl: "https://genacourtney.com/images/largeIcon.png",
        url: "https://genacourtney.com/images/largeIcon.png",
        width: 512,
        height: 512,
        alt: "Gena Courtney",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "https://genacourtney.com",
    title: "Gena Courtney",
    description: "Southern Art",
    images: ["https://genacourtney.com/images/largeIcon.png"],
  },
};

export const viewport: Viewport = {
  initialScale: 1,
  width: "device-width",
  minimumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(_nextAuthOptions);

  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className={`${charm.variable} ${openSans.variable}`}
    >
      <body className="font-openSans">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
