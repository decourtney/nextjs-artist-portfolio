import { Link } from "@heroui/react";
import Footer from "./_components/Footer";
import ContactForm from "@/app/(root)/_components/ContactForm";
import Image from "next/image";

const HomePage = async () => {
  return (
    <div className="min-h-screen">
      {/* Fixed Hero Section */}
      <div className="fixed top-0 left-0 w-full h-full -z-10">
        {/* <div className=""> */}
        <Image
          src="/images/hero-image.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        {/* </div> */}
        <div className="absolute top-20 left-10 flex h-full z-10">
          <h1 className="text-4xl md:text-9xl font-charm">Gena Courtney</h1>
        </div>
      </div>

      {/* Scrollable Content */}
      <div
        id="about"
        className="relative text-foreground-300 w-full min-h-screen mt-[100dvh] content-center bg-background-200 "
      >
        <div className="flex flex-col justify-center items-center w-full space-y-24">
          <h3 className="font-black text-6xl">Bio</h3>
          <div className="flex justify-center text-center w-1/2 h-1/2">
            <p className="text-2xl">
              Ipsum Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Numquam expedita dolore, tenetur illo perspiciatis ad fugiat sequi
              illum quasi maxime aperiam rem quisquam in eos enim incidunt ipsa
              officia facere.
            </p>
          </div>
        </div>

        <div className="flex justify-end items-end w-full mt-10 font-bold text-foreground-200 text-2xl md:text-5xl">
          <h2>visit the</h2>
          <Link
            href="/gallery"
            className={`font-charm group flex-col px-6 text-6xl lg:text-9xl text-primary-500`}
          >
            Gallery
          </Link>
        </div>
      </div>

      <div
        id="contact"
        className="relative w-full min-h-screen p-4 content-center bg-background-100"
      >
        <ContactForm />
      </div>

      <div className="relative w-full bg-background-100">
        <div className="absolute bottom-full left-0 w-full h-full pointer-events-none bg-gradient-to-t from-background-100 to-transparent" />
        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
