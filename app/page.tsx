import { Image } from "@heroui/react";

const HomePage = () => {
  return (
    <div className="flex justify-center h-full">
      <Image
        src="images/underconstruction.webp"
        alt="Under Construction"
        removeWrapper
        className="object-cover rounded-none"
      />
    </div>
  );
};

export default HomePage;
