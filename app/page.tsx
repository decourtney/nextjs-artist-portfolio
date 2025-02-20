'use client'

import { useState } from "react";
import { Image } from "@heroui/react";

const HomePage = () => {
  const [showOverlay, setShowOverlay] = useState(true);

  return (
    <section className="relative min-h-[calc(100dvh-40px)] h-[calc(100dvh-40px)]">
      {/* Overlay Message */}
      {showOverlay && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white p-8 rounded shadow-lg text-center max-w-sm">
            <h2 className="text-2xl font-bold mb-4">Work in Progress</h2>
            <p className="mb-6">
              This site is still under construction. Please check back later.
            </p>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => setShowOverlay(false)}
            >
              I Understand
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-center md:h-[60%] bg-[url(/images/mountains.jpg)] bg-cover bg-center">
        <div className="absolute w-full h-full bg-opacity-20 bg-white" />
        <div className="flex w-full h-full items-center p-[10%]">
          <Image src="images/logo.png" className="w-[80%]" />
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col md:flex-row justify-between w-full md:max-w-[90%] mx-auto">
        <div className="order-2 md:order-1 grid grid-cols-2 flex-1 md:max-w-[768px] p-4 gap-2 md:-translate-y-10 bg-background-50">
          <div className="w-auto h-56 max-h-56 bg-orange-100"></div>
          <div className="w-auto h-56 bg-purple-100"></div>
          <div className="w-auto h-56 bg-green-100"></div>
          <div className="w-auto h-56 bg-red-100"></div>
        </div>

        <div className="order-1 md:order-2 flex-1 p-4 md:-translate-y-20 text-background-50 bg-background-50">
          <div className="w-full h-full p-4 bg-cyan-900">
            <h2 className="text-center text-4xl font-bold">
              A Word from The Curator
            </h2>
            <div className="p-4 text-xl">
              <p>Blah blah blah</p>
            </div>
          </div>
        </div>

        <div className="order-3 flex-1 md:max-w-[768px] p-4 md:-translate-y-10 bg-background-50">
          <div className="w-full h-full bg-pink-200">
            <div className="p-5">
              <h3 className="text-center text-5xl font-serif">Be Inspired</h3>
            </div>
            <div className="grid grid-cols-2 p-2 gap-2 bg-background-50">
              <div className="w-auto h-56 bg-orange-100"></div>
              <div className="w-auto h-56 bg-purple-100"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
