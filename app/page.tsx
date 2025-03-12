import { Image, Link } from "@heroui/react";
import { charm } from "./fonts/fonts";

const HomePage = async () => {
  return (
    <div className="min-h-screen">
      {/* Fixed Hero Section */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        <div className="flex w-full h-full">
          <Image
            src="/images/water.jpg"
            alt=""
            removeWrapper
            radius="none"
            className="w-full h-auto object-cover object-top"
          />
        </div>
        <div className="absolute top-20 left-10 flex h-full z-10">
          <h1 className={`text-9xl ${charm.className}`}>Gena Courtney</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        id="about"
        className="relative w-full min-h-screen mt-[100dvh] p-4 content-center bg-background-200 bg-gradient-to-b from-sky-600 to-transparent"
      >
        <div className="absolute bottom-full left-0 w-full h-1/3 md:h-1/3 pointer-events-none bg-gradient-to-t from-sky-600 to-transparent" />
        
        <div className="flex flex-col justify-center items-center w-full space-y-24">
          <h3 className="font-black text-6xl">Bio</h3>
          <div className="flex justify-center text-center w-1/2 h-1/2">
            {/* <Image
                src={"/images/biopic2.jpg"}
                removeWrapper
                radius="none"
                className="w-full object-contain"
              /> */}
            <p className="text-2xl">
              Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Numquam expedita dolore, tenetur illo perspiciatis ad fugiat sequi
              illum quasi maxime aperiam rem quisquam in eos enim incidunt ipsa
              officia facere.
            </p>
          </div>
        </div>

        <div className="flex justify-end items-end w-full p-24 font-bold text-foreground-200 text-6xl">
          <h2>visit the </h2>
          <Link
            href="/gallery"
            className={`${charm.className} group flex-col pl-12 text-6xl lg:text-9xl text-primary-500`}
          >
            Gallery
            {/* <div className="text-9xl group-hover:translate-x-10 transition-transform duration-500 ease-in-out">
            <FaArrowRightLong />
          </div> */}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
