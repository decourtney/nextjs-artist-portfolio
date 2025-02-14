import { Image } from "@heroui/react";

const HomePage = () => {
  return (
    <div className="min-h-screen ">
      <div className="mx-auto w-[400px]">
        {/* <Image
          src="images/signature-highres.webp"
          alt="Gena Courtney"
          removeWrapper
          className="w-[500px] object-cover rounded-none"
        /> */}
          <Image src="images/logo.png" />
      </div>
    </div>
  );
};

export default HomePage;
