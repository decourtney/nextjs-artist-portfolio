import { Image } from "@heroui/react"; 


export default function Home() {
  return (
    <div className="flex justify-center h-full">
      <Image
        src="images/underconstruction.webp"
        alt="Under Construction"
        removeWrapper
        className="object-cover"
      />
    </div>
  );
}
