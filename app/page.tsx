import { Image } from "@heroui/react";

const HomePage = () => {
  return (
    <section className="relative ">
      <div className="relative">
        {/* <div className=""> */}
        <img
          src="images/mountains.JPEG"
          className="w-full max-h-[500px] object-cover opacity-50"
        />
        {/* </div> */}

        <div className="absolute top-1/2 left-0 -translate-y-1/2 max-w-[600px] ">
          <Image src="images/logo.png" className="w-full h-auto" />
        </div>
      </div>

      <div className="container absolute left-1/2 -translate-x-1/2 flex flex-row mx-auto">
        <div className="grid grid-cols-2 w-1/3 p-4 gap-2 -translate-y-10 bg-background-50">
          <div className="w-full h-48 bg-orange-100"></div>
          <div className="w-full h-48 bg-purple-100"></div>
          <div className="w-full h-48 bg-green-100"></div>
          <div className="w-full h-48 bg-red-100"></div>
        </div>
        <div className="w-1/3 p-4 -translate-y-20 text-background-50 bg-background-50">
          <div className="w-full h-full p-4 bg-cyan-900">
            <h2 className="text-center text-4xl font-bold">
              A Word from The Curator
            </h2>
            <div className="p-4 text-xl">
              <p>Blah blah blah</p>
            </div>
          </div>
        </div>
        <div className="w-1/3 p-4 -translate-y-10 bg-background-50">
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
