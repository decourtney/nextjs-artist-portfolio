import dbConnect from "@/lib/dbConnect";
import Illustration, { IIllustration } from "@/models/Illustration";
import Link from "next/link";
import React from "react";
import SectionSeparator from "./SectionSeparator";
import Book3D from "./Book3D";

const IllustrationSection = async () => {
  await dbConnect();

  const illustration = await Illustration.find({}, { name: 1, slug: 1 }).lean();

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto pb-16">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="w-full md:w-1/2">
            <h2 className="text-4xl font-charm mb-4 text-[#1e293b]">
              Midnight at Kyrie Eleison Castle
            </h2>
            <p className="text-[#475569] mb-6">
              Journey through a mystical night at Kyrie Eleison Castle, where
              shadows dance and secrets whisper in the moonlit corridors.
            </p>
            <p className="text-gray-500 text-sm italic mb-6">
              Each illustration is paired with its story, creating an immersive
              experience.
            </p>
            <Link
              href={`/gallery/illustration/${illustration[0].slug}`}
              className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
            >
              <span className="relative z-10">Read the Story</span>
              <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
            </Link>
          </div>
          <div className="w-full md:w-1/2">
            <Book3D title="Midnight at\nKyrie Eleison Castle" />
          </div>
        </div>
      </div>
      <SectionSeparator />
    </section>
  );
};

export default IllustrationSection;
