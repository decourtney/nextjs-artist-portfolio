import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <section className="w-full h-[calc(100dvh-80px)] p-4">
      <div className="flex justify-center h-full">
        <Image
          src="images/underconstruction.webp"
          alt="Under Construction"
          removeWrapper
          className="object-cover"
        />
      </div>
    </section>
  );
}
