import dbConnect from "@/lib/dbConnect";
import { Artwork, Tag } from "@/models";
import { ITag } from "@/models/Tag";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import SectionSeparator from "./SectionSeparator";

const CategorySection = async () => {
  await dbConnect();

  const categories = (await Tag.find({
    type: "category",
    label: { $ne: "Illustration" },
  })) as ITag[];

  const categoryImages = await Promise.all(
    categories.map(async (category) => {
      const categoryImage = await Artwork.findOne({
        category: category._id,
        isCategoryImage: true,
      }).populate("category");
      return categoryImage;
    }),
  );

  return (
    <section className="py-20 px-4 relative">
      <h1 className="sr-only">Art Categories</h1>
      <div className="max-w-6xl mx-auto relative grid grid-cols-1 md:grid-cols-2 gap-8 pb-16">
        {categories.map((category) => (
          <div key={category.label} className="flex flex-col">
            <h2 className="text-2xl font-charm mb-4">{category.label}</h2>
            <Link href={`/gallery/${category.label.replace(" ", "-")}`}>
              {categoryImages.find(
                (img) => img?.category.label === category.label,
              ) ? (
                <div className="relative aspect-square mb-4 w-full inset-0 border-2 border-[#1e293b] hover:border-blue-500 transition-colors duration-300">
                  <Image
                    src={
                      categoryImages.find(
                        (img) => img?.category.label === category.label,
                      )?.thumbSrc
                    }
                    fill
                    alt={category.label}
                    className="w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center w-full aspect-square">
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
  );
};

export default CategorySection;
