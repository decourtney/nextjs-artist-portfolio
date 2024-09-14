import { Image } from "@nextui-org/react";

export default function Home() {
  return (
    <main className="w-full h-[calc(100dvh-80px)] p-4 bg-red-700">
      <div className="flex justify-center h-full bg-blue-400">
        <Image
          src="images/underconstruction.webp"
          alt="Under Construction"
          removeWrapper
          className="object-cover"
        />
      </div>
    </main>
  );
}
