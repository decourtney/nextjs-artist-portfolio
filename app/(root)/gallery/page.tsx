import React from "react";
import Link from "next/link";
import Book3D from "@/app/(root)/_components/Book3D";
import dbConnect from "@/lib/dbConnect";
import { Artwork, Tag } from "@/models";
import { TagDocument } from "@/models/Tag";
import GetInTouchSection from "../_components/GetInTouchSection";
import SectionSeparator from "../_components/SectionSeparator";

const GalleryPage = async () => {
  await dbConnect();
  const categories = (await Tag.find({ type: "category" })) as TagDocument[];
  const categoryImages = await Promise.all(
    categories.map(async (category) => {
      const categoryImage = await Artwork.findOne({
        category: category._id,
        isCategoryImage: true,
      }).populate("category");
      return categoryImage;
    })
  );

  return (
    <>
      {/* Gallery Section */}
      <section className="py-20 px-4 relative">
        <h1 className="sr-only">Art Categories</h1>
        <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
          {categories.map((category) => (
            <div key={category.label} className="flex flex-col">
              <h2 className="text-2xl font-charm mb-4">{category.label}</h2>
              <Link
                href={`/gallery/${category.label.replace(" ", "-")}`}
                className="block border-2 border-black hover:border-blue-500 transition-colors duration-300"
              >
                {categoryImages.find(
                  (img) => img?.category.label === category.label
                ) ? (
                  <img
                    src={
                      categoryImages.find(
                        (img) => img?.category.label === category.label
                      )?.src
                    }
                    alt={category.label}
                    className="w-full aspect-square object-cover"
                  />
                ) : (
                  <div className="w-full aspect-square flex items-center justify-center">
                    <span className="text-2xl font-charm text-gray-700">
                      {category.label}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          ))}

          <SectionSeparator />
        </div>
      </section>

      {/* Illustration Section */}
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
                Each illustration is paired with its story, creating an
                immersive experience.
              </p>
              <a
                href="/gallery/illustration"
                className="group relative inline-block px-8 py-4 text-lg font-medium text-[#1e293b] hover:text-white transition-colors duration-300"
              >
                <span className="relative z-10">Read the Story</span>
                <span className="absolute inset-0 w-full h-full bg-[#3b82f6] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="absolute inset-0 w-full h-full border-2 border-[#1e293b] group-hover:border-[#3b82f6] transition-colors duration-300" />
              </a>
            </div>
            <div className="w-full md:w-1/2">
              <Book3D title="Midnight at\nKyrie Eleison Castle" />
            </div>
          </div>
        </div>
        <SectionSeparator />
      </section>

      <GetInTouchSection />
    </>
  );
};

export default GalleryPage;
