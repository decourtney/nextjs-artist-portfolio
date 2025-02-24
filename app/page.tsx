// "use client";

import { useState } from "react";
import { Button, Image, Link } from "@heroui/react";
import dbConnect from "@/lib/dbConnect";
import Artwork, { ArtworkDocument } from "@/models/Artwork";
import {
  dynalight,
  whisper,
  charm,
  engagement,
  romanesco,
  praise,
} from "./fonts/fonts";
import { FaArrowRight, FaLongArrowAltRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import Contact from "./components/ContactForm";
import Footer from "./footer";

const HomePage = async () => {
  // const [showOverlay, setShowOverlay] = useState(true);
  await dbConnect();
  const artworks: ArtworkDocument[] = await Artwork.find()
    .sort({ createdAt: -1 })
    .limit(6);

  return (
    <div className="min-h-screen">
      {/* Fixed Hero Section */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div id="hero" className="flex w-full h-full">
          <Image
            src="/images/water.jpg"
            removeWrapper
            radius="none"
            className="w-full h-auto object-cover object-top"
          />
        </div>
        <div className="absolute top-20 left-20 flex h-full pl-10 pt-10 z-10">
          <h1 className={`text-[200px] ${charm.className}`}>Gena Courtney</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        id="about"
        className="relative mt-[100dvh] p-24 w-full h-[75dvh] bg-background-200 bg-gradient-to-b from-emerald-300 to-transparent"
      >
        <div className="absolute bottom-full left-0 w-full h-1/3 md:h-1/3 pointer-events-none bg-gradient-to-t from-emerald-300 to-transparent" />
        <div className="flex flex-col justify-center items-center w-full h-full space-y-24 ">
          <h3 className="font-black text-9xl">Bio</h3>
          <div className="flex justify-center text-center w-1/2 h-1/2">
            {/* <Image
                src={"/images/biopic2.jpg"}
                removeWrapper
                radius="none"
                className="w-full object-contain"
              /> */}
            <p className="text-6xl">
              Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Numquam expedita dolore, tenetur illo perspiciatis ad fugiat sequi
              illum quasi maxime aperiam rem quisquam in eos enim incidunt ipsa
              officia facere.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-around w-full min-h-[75dvh] py-4 bg-background-200">
        <div>
          <h2 className="px-24 py-4 font-bold text-6xl">
            my <span className={`text-9xl ${charm.className}`}>Latest</span>{" "}
            works
          </h2>

          <ul className="flex flex-col lg:flex-row w-full h-full lg:h-[768px] shadow-xl">
            {artworks.map((artwork, index) => {
              let extraClasses = "";
              if (index === 0) extraClasses = "first";
              if (index === artworks.length - 1) extraClasses = "last";
              const marginBottomClass =
                index < artworks.length - 1
                  ? "mb-[-15%] md:mb-[-7%] lg:mb-0"
                  : "";
              return (
                <li
                  key={artwork.name}
                  className={`clipped-image ${extraClasses} ${marginBottomClass} w-full h-64 lg:h-full lg:-ml-[5%] hover:scale-105 transition-transform duration-500 ease-in-out`}
                >
                  <Link
                    href="/"
                    disableAnimation
                    className="w-full h-full hover:opacity-100"
                  >
                    <Image
                      src={artwork.thumbSrc}
                      alt={artwork.name}
                      removeWrapper
                      radius="none"
                      className="h-full w-full object-cover"
                      style={{ clipPath: "inherit" }}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="flex justify-end items-center w-full h-[768px] p-24 font-bold text-foreground-200 text-6xl lg:text-8xl bg-background-200">
        <h2>visit the </h2>
        <Link
          href="/gallery"
          className={`${charm.className} group flex-col pl-12 text-6xl lg:text-[300px] text-primary-500`}
        >
          <h2>Gallery</h2>
          <div className="text-9xl group-hover:translate-x-10 transition-transform duration-500 ease-in-out">
            <FaArrowRightLong />
          </div>
        </Link>
      </div>

      <div className="min-h-[50dvh] p-24 bg-background-200">
        <h2 className="text-8xl text-foreground-200 font-bold">
          go on a{" "}
          <span className={`${charm.className} text-[300px] text-primary-500`}>
            Journey
          </span>
        </h2>
        <div className="h-[50dvh] content-center font-black text-center text-9xl text-foreground-200 bg-foreground-600 rounded-2xl">
          <p className="">Coming Soon</p>
        </div>
      </div>

      <div
        id="contact"
        className="flex flex-col justify-between h-screen p-4 bg-foreground-200"
      >
        <div className="flex flex-col w-full h-full p-24">
          <h2 className="text-9xl text-end">Stay in Touch</h2>

          <div className="flex h-3/4 content-center">
            <div className="w-1/2 content-center text-6xl text-right ">
              <div>
                Ipsom Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Vitae recusandae amet cum dolor adipisci quis sit beatae ad
                explicabo nam eos quia, obcaecati unde expedita eaque molestias
                debitis quaerat illum?
              </div>
            </div>
            <div className="w-full max-w-[900px] mx-auto my-auto  ">
              <Contact />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
