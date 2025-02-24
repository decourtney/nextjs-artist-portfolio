import { Providers } from "./providers";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "./navbar";
// import Footer from "./footer";

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
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning={true}
      className="bg-background-100"
    >
      <body
        className={``}
      >
        <Providers>
          <Navbar />
          <main className="flex flex-col text-foreground-900">{children}</main>
          {/* <Footer /> */}
        </Providers>
      </body>
    </html>
  );
}
