// "use client";

import { useState } from "react";
import { Button, Image, Link } from "@heroui/react";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";

const HomePage = async () => {
  // const [showOverlay, setShowOverlay] = useState(true);
  await dbConnect();
  const artworks: ArtworkDocument[] = await Artwork.find()
    .sort({ createdAt: -1 })
    .limit(5);

  return (
    <div className="relative min-h-[calc(100dvh-40px)] h-[calc(100dvh-40px)]">
      {/* Overlay Message */}
      {/* {showOverlay && (
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
      )} */}

      <div className="w-full h-full max-h-[calc(90dvh)] bg-[url('/images/water.jpg')] bg-center bg-cover bg-no-repeat bg-opacity-50">
        {/* <div className="absolute w-full h-full bg-opacity-30 bg-white" /> */}
        <div className="pl-10 pt-10 w-full h-full">
          <Image
            src="images/logo.png"
            alt="Stylized oversized straw hat hanging on the letter G in Gena Courtney with two crossed paintbrushes below the name."
            removeWrapper
            radius="none"
          />
        </div>
      </div>

      <div className="lg:h-[60%] bg-gradient-to-b from-emerald-300 to-transparent">
        <div className="relative h-full content-center">
          {/* Top gradient overlay */}
          <div className="absolute bottom-[100%] left-0 w-full h-1/3 md:h-full pointer-events-none bg-gradient-to-t from-emerald-300 to-transparent" />
          <div>
            <h3 className="font-black text-9xl">BIG WORDS</h3>
            <div className="w-[50%] ml-auto mr-10">
              <p className="text-right text-4xl">
                Ipsum Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Exercitationem perspiciatis cumque assumenda numquam sunt quod
                mollitia, aspernatur possimus esse ab, tempora, pariatur vel
                facere nam inventore amet fuga repudiandae! Molestias?
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-center w-full h-[60%] py-4">
        <Link
          href="/gallery"
          className="flex-1 p-4 font-bold text-6xl lg:text-8xl hover:scale-105 origin-left transition-transform duration-[300ms] ease-in-out"
        >
          Take a Scroll Through the Gallery
        </Link>

        <ul className="flex flex-col lg:flex-row lg:justify-end w-full lg:w-[65%] h-full overflow-hidden">
          {artworks.map((artwork, index) => {
            let extraClasses = "";
            if (index === 0) extraClasses = "first";
            if (index === artworks.length - 1) extraClasses = "last";
            // Add negative bottom margin on mobile (vertical display) except for the last image
            const marginBottomClass =
              index < artworks.length - 1
                ? "mb-[-15%] md:mb-[-7%] lg:mb-0"
                : "";
            return (
              <li
                key={artwork.name}
                className={`clipped-image ${extraClasses} ${marginBottomClass} w-full lg:w-1/5 h-64 lg:h-full lg:-ml-[5%] hover:scale-105 transition-transform duration-[300ms] ease-in-out`}
              >
                <Link href="/" className="w-full h-full">
                  <img
                    src={artwork.thumbSrc}
                    alt={artwork.name}
                    className="h-full w-full object-cover"
                    style={{ clipPath: "inherit" }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="h-[400px]"></div>

      {/* <div className="absolute left-1/2 -translate-x-1/2 w-full bg-foreground-200">
        <div className="relative flex flex-col md:flex-row justify-between  md:max-w-[90%] mx-auto">
          <div className="relative order-2 md:order-1 grid grid-cols-2 flex-1 md:max-w-[768px] p-4 gap-2 md:-translate-y-10 bg-background-300">
            <div className="w-full h-full bg-cyan-900">
              <Link href="/gallery" className="w-full h-full p-2 text-2xl">
                Browse the Gallery
              </Link>
            </div>
            {artworks.map((artwork) => (
              <img
                key={artwork._id}
                src={artwork.thumbSrc}
                alt={artwork.name}
                className="object-cover w-full h-full"
              />
            ))}
          </div>

          <div className="order-1 md:order-2 flex-1 p-4 md:-translate-y-20 text-background-50 bg-background-300">
            <div className="w-full h-full p-4 bg-cyan-900">
              <h2 className="text-center text-4xl font-bold">
                A Word from The Curator
              </h2>
              <div className="p-4 text-xl">
                <p>Blah blah blah</p>
              </div>
            </div>
          </div>

          <div className="order-3 flex-1 md:max-w-[768px] p-4 md:-translate-y-10 bg-background-300">
            <div className="w-full h-full bg-pink-200">
              <div className="p-5">
                <h3 className="text-center text-5xl font-serif">
                  Get in Touch
                </h3>
              </div>
              <div className="grid grid-cols-2 p-2 gap-2 bg-background-50">
                <div className="w-auto h-56 bg-orange-100"></div>
                <div className="w-auto h-56 bg-purple-100"></div>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;
