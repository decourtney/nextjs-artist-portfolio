"use client";

import { Providers } from "../../providers";

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="w-full h-screen bg-black">{children}</div>
    </Providers>
  );
}
