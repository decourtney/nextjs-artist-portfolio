import { Image } from "@heroui/react";

const HomePage = () => {
  return (
    <section className="relative ">
      <div className="flex justify-center h-[500px] bg-[url(/images/mountains.jpg)] bg-cover bg-center">
        <div className="absolute w-full h-full bg-opacity-20 bg-white" />
        <div className="flex w-full h-full items-center md:max-w-[90%] 2xl:max-w-[70%]">
          <Image src="images/logo.png" className="max-w-[600px]" />
        </div>
      </div>

      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col md:flex-row justify-between w-full md:max-w-[90%] 2xl:max-w-[70%] mx-auto">
        <div className="order-2 md:order-1 grid grid-cols-2 flex-1 md:max-w-[424px] p-4 gap-2 md:-translate-y-10 bg-background-50">
          <div className="w-full h-48 bg-orange-100"></div>
          <div className="w-full h-48 bg-purple-100"></div>
          <div className="w-full h-48 bg-green-100"></div>
          <div className="w-full h-48 bg-red-100"></div>
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

        <div className="order-3 flex-1 max-w-[424px] p-4 md:-translate-y-10 bg-background-50">
          <div className="w-full h-full bg-pink-200">
            <div className="p-5">
              <h3 className="text-center text-5xl font-serif">Be Inspired</h3>
            </div>
            <div className="grid grid-cols-2 p-2 gap-2 bg-background-50">
              <div className="w-full h-48 bg-orange-100"></div>
              <div className="w-full h-48 bg-purple-100"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomePage;
